import { ApolloError } from "apollo-server";
import { GraphQLScalarType } from "graphql";
import { isISO8601 } from "validator";

// The value of DateTimeResolver must be an instantiation of GraphQLScalarType
// This constructor expects to be passed an object containing the scalar's
// name, description, and three methods that set the rules for input & output,
// always called parseValue, parseLiteral, and serialize
export const DateTimeResolver = new GraphQLScalarType({
  name: "DateTime",
  description: "An ISO 8601-encoded UTC date string.",
  // parseValue ensures the value sent FROM the client is a valid date string
  parseValue: value => {
    if (isISO8601(value)) {
      return value;
    }
    throw new ApolloError("DateTime must be a valid ISO 8601 Date string.");
  },
  // serialize ensures the value sent TO the client is a valid date string
  serialize: value => {
    // We do an extra check here to make sure it's a string before sending it,
    // because MongoDB stores dates as Date objects
    if (typeof value !== "string") {
      value = value.toISOString();
    }
    if (isISO8601(value)) {
      return value;
    }
    throw new ApolloError("DateTime must be a valid ISO 8601 Date string.");
  },
  // parseLiteral ensures the GraphQL AST value is a valid date string
  parseLiteral: ast => {
    if (isISO8601(ast.value)) {
      return ast.value;
    }
    throw new ApolloError("DateTime must be a valid ISO 8601 Date string.");
  }
});
