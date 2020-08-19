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
    user: Profile!
    "The date and time the run document was created."
    createdAt: DateTime!
    "Whether the run is blocked."
    isBlocked: Boolean
    "Distance of the run, in km."
    distance: Float!
    "User-supplied name for the run."
    title: String!
    "Date and time the run began."
    start: DateTime!
    "Duration of the run, in ms."
    duration: Int!
    "Type of run workout."
    workoutType: RunWorkoutType!
    "Temperature, in degrees C."
    tempInC: Float
    "Weather conditions during the run."
    weather: [WeatherCondition]
    "Whether the run was on a treadmill or not. Defaults to false."
    treadmill: Boolean
    "Perceived effort level of the run. 1 is least, 5 is maximum."
    effort: Int
    "User rating of the run. 1 is worst, 5 is best."
    rating: Int
    "Whether the run has been completed or is planned. Defaults to true."
    completed: Boolean!
    "Finish position overall, if the run was a race."
    racePosition: Int
    "Number of participants overall, if the run was a race."
    raceFieldSize: Int
    "Finish position in age group, if the run was a race."
    raceAgeGroupPosition: Int
    "Number of participants in age group, if the run was a race."
    raceAgeGroupFieldSize: Int
    "The URL of a media file associated with the run."
    media: String
    "Miscellaneious user notes describing the run."
    notes: String
  }

  """
  Workout type options for runs.
  """
  enum RunWorkoutType {
    "Default workout type if none was chosen by user."
    DefaultRun
    "Easy effort, usual workaday run."
    Easy
    "Hill repeats."
    Hills
    "Timed speedwork of set distance intervals."
    Intervals
    "Long, slow run."
    Long
    "A formal race."
    Race
    "Gentle recovery jog."
    Recovery
    "Hard, sustained run near the aerobic theshold."
    Tempo
  }

  """
  Weather condition options for runs.
  """
  enum WeatherCondition {
    "Sunny."
    SUNNY
    "High humidity."
    HUMID
    "High winds."
    WIND
    "Snow."
    SNOW
    "Rain."
    RAIN
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
    "Order runs ascending by date."
    start_ASC
    "Order runs descending by date."
    start_DESC
  }

  """
  Provides a filter on which runs may be queried.
  """
  input RunWhereInput {
    """
    Whether to include runs that have been blocked by a moderator.
    Default is true.
    """
    includeBlocked: Boolean
  }

  """
  Provides a search string to query runs by text in their title.
  """
  input RunSearchInput {
    "The text string to search for in the run title."
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
    "The unique username of the user who owns the run."
    username: String!
    "Distance of the run, in km."
    distance: Float!
    "User-supplied name for the run."
    title: String!
    "Date and time the run began."
    start: DateTime!
    "Duration of the run, in ms."
    duration: Int!
    "Type of run workout."
    workoutType: RunWorkoutType!
    "Temperature, in degrees C."
    tempInC: Float
    "Weather conditions during the run."
    weather: [WeatherCondition]
    "Whether the run was on a treadmill or not. Defaults to false."
    treadmill: Boolean
    "Perceived effort level of the run. 1 is least, 5 is maximum."
    effort: Int
    "User rating of the run. 1 is worst, 5 is best."
    rating: Int
    "Whether the run has been completed or is planned. Defaults to true."
    completed: Boolean!
    "Finish position overall, if the run was a race."
    racePosition: Int
    "Number of participants overall, if the run was a race."
    raceFieldSize: Int
    "Finish position in age group, if the run was a race."
    raceAgeGroupPosition: Int
    "Number of participants in age group, if the run was a race."
    raceAgeFieldSize: Int
    "Miscellaneious user notes describing the run."
    notes: String
    "The post's media with the stream, filename, mimetype and encoding."
    media: Upload
  }

  """
  Provides data to update a run.
  """
  input UpdateRunInput {
    "The unique username of the user who owns the run."
    username: String!
    "Distance of the run, in km."
    distance: Float!
    "User-supplied name for the run."
    title: String!
    "Date and time the run began."
    start: DateTime!
    "Duration of the run, in ms."
    duration: Int!
    "Type of run workout."
    workoutType: RunWorkoutType!
    "Temperature, in degrees C."
    tempInC: Float
    "Weather conditions during the run."
    weather: [WeatherCondition]
    "Whether the run was on a treadmill or not. Defaults to false."
    treadmill: Boolean
    "Perceived effort level of the run. 1 is least, 5 is maximum."
    effort: Int
    "User rating of the run. 1 is worst, 5 is best."
    rating: Int
    "Whether the run has been completed or is planned. Defaults to true."
    completed: Boolean!
    "Finish position overall, if the run was a race."
    racePosition: Int
    "Number of participants overall, if the run was a race."
    raceFieldSize: Int
    "Finish position in age group, if the run was a race."
    raceAgeGroupPosition: Int
    "Number of participants in age group, if the run was a race."
    raceAgeFieldSize: Int
    "Miscellaneious user notes describing the run."
    notes: String
    "The post's media with the stream, filename, mimetype and encoding."
    media: Upload
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
