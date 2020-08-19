import { UserInputError } from "apollo-server";

// The Pagination class is where we define generalized methods that 
//  MongoDB-based data sources can use to facilitate pagination. It's
// generic enough that it can be used by both the profiles & runs services.

class Pagination {
  // Because we want this class to be repurposed, we pass a Mongoose model 
  // in to the constructor when we instantiate a new Pagination object.
  constructor(Model) {
    this.Model = Model;
  }

  // Get documents and cast them into the correct edge/node shape
  async getEdges(queryArgs, projection) {
    const {
      after,
      before,
      first,
      last,
      filter = {},
      sort = {}
    } = queryArgs;
    const isSearch = this._isSearchQuery(sort);
    let edges;

    // Handle user input errors
    if (!first && !last) {
      throw new UserInputError("Provide a 'first' or 'last' value to paginate this connection.");
    } else if (first && last) {
      throw new UserInputError("Passing both 'first' and 'last' arguments is not supported with this connection.");
    } else if (first < 0 || last < 0) {
      throw new UserInputError("Minimum record request for 'first' and 'last' arguments is 0.");
    } else if (first > 100 || last > 100) {
      throw new UserInputError("Maximum record request for 'first' and 'last' arguments is 100.");
    } else if (!first && isSearch) {
      throw new UserInputError("Search queries may only be paginated forward.");
    }

    if (isSearch) {
      const operator = this._getOperator(sort);
      const pipeline = await this._getSearchPipeline(
        after,
        filter,
        first,
        operator,
        sort,
        projection
      );
      const docs = await this.Model.aggregate(pipeline);

      edges = docs.length
        ? docs.map(doc => ({ node: doc, cursor: doc._id }))
        : [];
    } else if (first) {
      // If "first" is supplied, then handle forward pagination. 
      // Use MongoDB's find method, passing it the filter, 
      // to grab all applicable results. Then we chain a sort method,
      // passing it the supplied sort argument, and chain a limit method,
      // restricting it to the number of documents per page in "first".

      const operator = this._getOperator(sort);

      // Generate the combined query document if after has a value, otherwise,
      // use the regular filter as a query document to get the first page of
      // results, since if there's no "after", we're starting at the start
      const queryDoc = after
        ? await this._getFilterWithCursor(after, filter, operator, sort)
        : filter;
      const docs = await this.Model.find(queryDoc)
        .select(projection)
        .sort(sort)
        .limit(first)
        .exec();

      // Map over that resulting array, producing our edges array, with each
      // item containing its cursor and the actual data in the node object
      edges = docs.length
        ? docs.map(doc => ({ cursor: doc._id, node: doc }))
        : [];
    } else {
      // If "first" is not supplied, then it's "last", so, backward pagination.
      // Works much the same as fwd, except we first call _reverseSort.. to 
      // get the sort direction, and use the output of that to set the operator
      // Also the ternary that sets the queryDoc value checks "before" instead
      // of "after". We chain the reverse method onto the output of map bc 
      // even though we have to start counting documents from the end (which 
      // is why we flipped the sort direction), we still want individual 
      // results on the page to be in the correct ascending or descending order
      const reverseSort = this._reverseSortDirection(sort);
      const operator = this._getOperator(reverseSort);

      const queryDoc = before
        ? await this._getFilterWithCursor(before, filter, operator, reverseSort)
        : filter;

      const docs = await this.Model.find(queryDoc)
        .select(projection)
        .sort(reverseSort)
        .limit(last)
        .exec();

      edges = docs.length
        ? docs.map(doc => ({ node: doc, cursor: doc._id })).reverse()
        : [];
    }

    return edges;
  }

  // Get pagination information
  async getPageInfo(edges, queryArgs) {
    if (edges.length) {
      const { filter = {}, sort = {} } = queryArgs;
      const startCursor = this._getStartCursor(edges);
      const endCursor = this._getEndCursor(edges);
      const hasNextPage = await this._getHasNextPage(
        endCursor,
        filter,
        sort
      );
      const hasPreviousPage = await this._getHasPreviousPage(
        startCursor,
        filter,
        sort
      );

      return {
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor
      };
    }

    return {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null
    }
  }

  // getEdges and getPageInfo are what a data source uses to fetch the
  // required documents and page info for a given resolver. The rest of 
  // these methods are used internally by this class to support the first
  // two methods (hence the _ naming, which informally indicates private 
  // methods, by convention.)

  // Add the cursor ID with the correct comparison operator to the query filter
  // fromCursorId: typically either the after or before value
  // filter: an array containing the followed profile IDs
  // sort: the MongoDB sort object
  // operator: specifies whether we want results $lt or $gt than the cursor ID.

  async _getFilterWithCursor(fromCursorId, filter, operator, sort) {
    let filterWithCursor = { $and: [filter] };
    const fieldArr = Object.keys(sort);

    // Check that the sort object is not empty, and put its single key into
    // the field variable. If it is, we'll use _id as the default key
    const field = fieldArr.length ? fieldArr[0] : "_id";

    // Get the document that matches fromCursorId on the _id field
    // We chain a select() method because we don't need all the fields from 
    // the matching doc, just the one we use for sorting
    const fromDoc = await this.Model.findOne({ _id: fromCursorId })
      .select(field)
      .exec();

    if (!fromDoc) {
      throw new UserInputError(`No record found for ID '${fromCursorId}'`);
    }

    // Push the additional filter on the $and array & return the updated filter
    filterWithCursor.$and.push({
      [field]: { [operator]: fromDoc[field] }
    });

    return filterWithCursor;
  }

  // Create the aggregation pipeline to paginate a full-text search
  async _getSearchPipeline(
    fromCursorId,
    filter,
    first,
    operator,
    sort,
    projection = "_id"
  ) {
    const projectionDoc = projection.split(" ").reduce((acc, field) => {
      acc[field] = 1;
      return acc;
    }, {});
    // MongoDB's aggregate method takes an array argument to describe the
    // ordered sequence of data aggregation stages to apply to documents
    // in the database. The $match stage is like creating a queryDocument
    // for a regular MongoDB operation. It's typically followed by a $sort
    // and a $limit stage, before returning the matching documents.
    const textSearchPipeline = [
      { $match: filter },
      { $project: { ...projectionDoc, score: { $meta: "textScore" } } },
      { $sort: sort }
    ];
    // First we $match the documents, then we use $project to keep all
    // existing fields from the projectionDoc but also add the score 
    // field, on which to sort, then we $sort by relevance

    // add a $match stage to get results after a specific cursor
    if (fromCursorId) {
      // If fromCursorId is defined, then find the fromDoc and add the 
      // text search to the query document, and specify a projection 
      // document that includes the score
      const fromDoc = await this.Model.findOne({
        _id: fromCursorId,
        $text: { $search: filter.$text.$search }
      })
        .select({ score: { $meta: "textScore" } })
        .exec();

      if (!fromDoc) {
        throw new UserInputError(`No record found for ID '${fromCursorId}'`);
      }

      // If there are no errors while retrieving the fromDoc, then add
      // another $match stage to the pipeline that returns documents where
      // the score is either greater or less than the _id of the fromDoc. 
      // When looking ahead to the next page of results, the operator will 
      // be $lt, bc the docs are sorted in descending order by score & _id. 
      // When looking behind to the previous page, the operator is $gt.
      textSearchPipeline.push({
        $match: {
          $or: [
            { score: { [operator]: fromDoc._doc.score } },
            {
              score: { $eq: fromDoc._doc.score },
              _id: { [operator]: fromCursorId }
            }
          ]
        }
      });
    }

    // At the very end of the pipeline, add our $limit
    textSearchPipeline.push({ $limit: first });

    // Return our array of pipeline stages to pass into the aggregate method
    return textSearchPipeline;
  }

  // Reverse the sort direction when queries need to look in the opposite 
  // direction of the set sort order (eg next/previous page checks)
  _reverseSortDirection(sort) {
    const fieldArr = Object.keys(sort);

    // Check if the sort object was empty
    if (fieldArr.length === 0) {
      // If so, flip the $natural sort order (the default sort order that 
      // MongoDB refers to the documents on disk)
      return { $natural: -1 };
    }

    // If sort object has content, then return a new object where the
    // sort order was reversed (we don't want to mutate the original sort
    // object; that'd cause problems elsewhere in the pagination code)
    const field = fieldArr[0];
    return { [field]: sort[field] * -1 };
  }

  // Get the correct comparison operator based on the sort order
  _getOperator(sort, options = {}) {
    const orderArr = Object.values(sort);
    const checkPreviousTextScore = options && options.checkPreviousTextScore
      ? options.checkPreviousTextScore
      : false;
    let operator;

    if (this._isSearchQuery(sort)) {
      operator = checkPreviousTextScore ? "$gt" : "$lt";
    } else {
      operator = orderArr.length && orderArr[0] === -1 ? "$lt" : "$gt";
    }

    return operator;
  }

  // Determine if a query is a full-text search based on the sort expression
  _isSearchQuery(sort) {
    const fieldArr = Object.keys(sort);
    return fieldArr.length && fieldArr[0] === "score";
  }

  // Check if a next page of results is available
  async _getHasNextPage(endCursor, filter, sort) {
    const isSearch = this._isSearchQuery(sort);
    const operator = this._getOperator(sort);
    let nextPage;

    if (isSearch) {
      const pipeline = await this._getSearchPipeline(
        endCursor,
        filter,
        1,
        operator,
        sort
      );
      const result = await this.Model.aggregate(pipeline);
      nextPage = result.length;
    } else {
      // Create a queryDoc like above, but use the endCursor value for the 
      // fromCursorId argument, because we want to know if anything exists 
      // beyond the end cursor.
      const queryDoc = await this._getFilterWithCursor(
        endCursor,
        filter,
        operator,
        sort
      );
      // Pass the queryDoc into findOne and chain a select method to only get
      // the _id, because we don't care about the content, just whether it
      // exists, then apply the sort.
      nextPage = await this.Model.findOne(queryDoc)
        .select("_id")
        .sort(sort);
    }

    // Coerce the returned document or null into a boolean to return
    return Boolean(nextPage);
  }

  // Check if a previous page of results is available
  async _getHasPreviousPage(startCursor, filter, sort) {
    const isSearch = this._isSearchQuery(sort);
    let prevPage;

    if (isSearch) {
      const operator = this._getOperator(sort, {
        checkPreviousTextScore: true
      });
      const pipeline = await this._getSearchPipeline(
        startCursor,
        filter,
        1,
        operator,
        sort
      );
      const result = await this.Model.aggregate(pipeline);
      prevPage = result.length;
    } else {
      const reverseSort = this._reverseSortDirection(sort);
      const operator = this._getOperator(reverseSort);
      const queryDoc = await this._getFilterWithCursor(
        startCursor,
        filter,
        operator,
        reverseSort
      );
      prevPage = await this.Model.findOne(queryDoc)
        .select("_id")
        .sort(reverseSort);
    }

    return Boolean(prevPage);
  }

  // Get the ID of the first document in the paging window 
  _getStartCursor(edges) {
    if (!edges.length) {
      return null;
    }
    return edges[0].cursor;
  }

  // Get the ID of the last document in the paging window
  _getEndCursor(edges) {
    if (!edges.length) {
      return null;
    }
    return edges[edges.length - 1].cursor;
  }
}

export default Pagination;
