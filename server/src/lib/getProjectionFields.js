import { parseResolveInfo } from "graphql-parse-resolve-info";

export default function getProjectionFields(resolverInfo, modelSchema) {
  const parsedInfo = parseResolveInfo(resolverInfo);
  const returnType = Object.keys(parsedInfo.fieldsByTypeName).filter(
    field => field !== "_Entity"
  )[0];
  const baseType = returnType.replace("Connection", "");
  const modelSchemaFields = Object.keys(modelSchema.obj);
  const linkedFields = ["account", "run"];
  let queryFields;

  // Check if we are dealing with a paginated query. If we are, 
  // retrieve the field keys for the inner node type only. Otherwise, 
  // get all of the keys from 'fields'
  if (parsedInfo.fieldsByTypeName[returnType].hasOwnProperty("edges")) {
    const nodeFields =
      parsedInfo.fieldsByTypeName[returnType].edges.fieldsByTypeName[
        `${baseType}Edge`
      ].node.fieldsByTypeName[baseType];
    queryFields = Object.keys(nodeFields);
  } else {
    queryFields = Object.keys(parsedInfo.fieldsByTypeName[returnType]);
  }

  // Clean up query fields that don't match up with model schema fields
  // Rewrite "linked" field names so they match up with the model schema
  // ie, 'author' becomes 'authorProfileId', etc
  linkedFields.forEach(field => {
    const fieldIndex = queryFields.indexOf(field);

    if (fieldIndex === -1) {
      return;
    } else {
      queryFields[fieldIndex] = `${field}Id`;
    }
  });

  // Remove any fields that don't exist in the model schema 
  const trimmedQueryFields = queryFields.filter(field =>
    modelSchemaFields.includes(field)
  );

  // Explicitly include the '_id' field in every projection
  trimmedQueryFields.push("_id");

  // Return the field names joined as string with a space delimiter
  // eg, '_id authorProfileId text'
  return trimmedQueryFields.join(" ");
}

// The string returned from this function can be passed directly into 
// Mongoose's "select" method.
