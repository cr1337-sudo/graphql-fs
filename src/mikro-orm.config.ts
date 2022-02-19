import Post from "./entities/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    dropTables: false,
  },
  type: "mysql",
  host: "b3ubwcdovljzfijhuoup-mysql.services.clever-cloud.com",
  port: 3306,
  user: "ukc7uhozs91oqonm",
  password: "bqYlmbIkXfQvEyXZ46VI",
  dbName: "b3ubwcdovljzfijhuoup",
  entities: [Post, User],
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
