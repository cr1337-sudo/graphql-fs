import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  // await orm.getMigrator().up()

  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });

  await redisClient.connect().then(() => console.log("conetado a redis"));

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__, //Cookies just works in https
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "secretword",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    //Graphql schema
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(8000, () => {
    console.log("Server running");
  });
};

main().catch((e) => {
  console.log(e);
});
