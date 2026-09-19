const app = require("./app");
const { PORT } = require("./config/env");
const connectDB = require("./config/db");

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
