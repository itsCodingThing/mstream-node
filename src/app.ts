import express from "express";
import cors from "cors";
import morgon from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import router from "./routes/routes";
import errorHandler from "./utils/errorHandler";
import AudioResolver from "./resolvers/AudioResovler";

// Build schema from the resolvers
const schema = await buildSchema({ resolvers: [AudioResolver] });

const app = express();
const apolloServer = new ApolloServer({ schema });

app.use(cors());
app.use(express.json());

app.use("/api", morgon("dev"), router);

app.get("/", (_req, res) => {
    return res.send(`Home Route ${process.env.NODE_ENV}`);
});

// Setting a Error hadler for whole app
app.use(errorHandler);

// Setting a graphql server at "/graphql"
apolloServer.applyMiddleware({ app, path: "/graphql" });

export default app;
