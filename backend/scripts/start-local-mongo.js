const fs = require("fs");
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");

const dbPath = path.resolve(__dirname, "../.data/mongo");

fs.mkdirSync(dbPath, { recursive: true });

async function start() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: "bis-recommendation-engine",
      dbPath,
      storageEngine: "wiredTiger",
    },
  });

  console.log("Local MongoDB is listening on 127.0.0.1:27017");

  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Failed to start local MongoDB:", error.message);
  process.exit(1);
});
