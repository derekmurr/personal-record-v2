import { gql } from "apollo-server";

const typeDefs = gql`
  """
  An ISO 8601-encoded UTC date string.
  """
  scalar DateTime

  """
  The file upload type built into Apollo Server 2.0+.
  """
  scalar Upload

  """
  A run contains all information about a single workout.
  """
  type Run {
    "The unique MongoDB document ID of the run."
    id: ID!
    "The profile of the user who owns the run."
    author: Profile!
    "The date and time the run document was created."
    createdAt: DateTime!
    "Whether the run is blocked."
    isBlocked: Boolean
    "The URL of a media file associated with the run."
    media: String
    "Miscellaneious user notes describing the run."
    notes: String
  }

  extend type Profile @key(fields: "id") {
    id: ID! @external
    "A list of runs owned by the user."
    runs(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: RunOrderByInput
    ): RunConnection
  }

  """
  Information about pagination in a connection.
  """
  type PageInfo {
    "The cursor to continue from when paginating forward."
    endCursor: String
    "Whether there are more items when paginating forward."
    hasNextPage: Boolean!
    "Whether there are more items when paginating backward."
    hasPreviousPage: Boolean!
    "The cursor to continue from when paginating backward."
    startCursor: String
  }

  """
  A list of post edges with pagination information.
  """
  type RunConnection {
    "A list of run edges."
    edges: [RunEdge]
    "Information to assist with pagination."
    pageInfo: PageInfo!
  }

  """
  A single run node with its cursor.
  """
  type RunEdge {
    "A cursor for use in pagination."
    cursor: ID!
    "A post at the end of an edge."
    node: Run!
  }

  """
  Sorting options for run connections.
  """
  enum RunOrderByInput {
    "Order runs ascending by creation time."
    createdAt_ASC
    "Order runs descending by creation time."
    createdAt_DESC
  }

  """
  Provides a filter on which runs may be queried.
  """
  input RunWhereInput {
    """
    The unique username of the user viewing runs by users they follow.
    Results include their own runs.
    """
    followedBy: String
    """
    Whether to include runs that have been blocked by a moderator.
    Default is true.
    """
    includeBlocked: Boolean
  }

  """
  Provides a search string to query runs by text in their name.
  """
  input RunSearchInput {
    "The text string to search for in the run name."
    text: String!
  }

  extend type Query {
    "Retrieves a single run by MongoDB document ID."
    run(id: ID!): Run!

    "Retrieves a list of runs."
    runs(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: RunOrderByInput
      filter: RunWhereInput
    ): RunConnection

    """
    Performs a search of runs.
    Results are available in descending order by relevance only.
    """
    searchRuns(
      after: String
      first: Int
      query: RunSearchInput!
    ): RunConnection
  }

  """
  Provides data to create a run.
  """
  input CreateRunInput {
    "The post's media with the stream, filename, mimetype and encoding."
    media: Upload
    "The body content of the post (max 256 characters)."
    text: String!
    "The unique username of the user who authored the post."
    username: String!
  }

  """
  Provides data to update a run.
  """
  input UpdateRunInput {
    
  }

  """
  Provides the unique ID of an existing run.
  """
  input RunWhereUniqueInput {
    "The unique MongoDB document ID associated with the run."
    id: ID!
  }

  extend type Mutation {
    "Creates a new run."
    createRun(data: CreateRunInput!): Run!

    "Updates a run."
    updateRun(
      data: UpdateRunInput!
      where: RunWhereUniqueInput!
    ): Run!

    "Deletes a run."
    deleteRun(where: RunWhereUniqueInput!): ID!

    "Toggles the current blocked state of the run."
    toggleRunBlock(where: RunWhereUniqueInput!): Run!
  }
`;

export default typeDefs;
