import "graphql-import-node";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphql";
import { context } from "./graphql/context";
import logger from "./logger";

// Configure .env file source
dotenv.config({ path: "./../.env" });

/** Run server */
async function main() {
  const app = express();
  const apolloServer = new ApolloServer({ context, schema });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 4001;
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests; please try again later"
  });

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(limiter);

  app.listen(PORT, () => {
    logger.info(`Running on http://localhost:${PORT}`);
  });
}

main();
