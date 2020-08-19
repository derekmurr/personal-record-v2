import { ApolloServer } from "apollo-server";
import { applyMiddleware } from "graphql-middleware";
import { buildFederatedSchema } from "@apollo/federation";

import RunDataSource from "./datasources/RunDataSource";
import initMongoose from "../../config/mongoose";
import { initDeleteProfileQueue, onDeleteProfile } from "./queues";
import permissions from "./permissions";
import Run from "../../models/Run";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

(async () => {
  const port = process.env.RUNS_SERVICE_PORT;
  const deleteProfileQueue = await initDeleteProfileQueue();

  deleteProfileQueue.listen(
    { interval: 5000, maxReceivedCount: 5 },
    onDeleteProfile
  );

  const schema = applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions
  );

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const user = req.headers.user ? JSON.parse(req.headers.user) : null;
      return { user };
    },
    dataSources: () => {
      return {
        runAPI: new RunDataSource({ Run })
      };
    }
  });

  initMongoose();

  const { url } = await server.listen({ port });
  console.log(`Run service ready at ${url}`);
})();
