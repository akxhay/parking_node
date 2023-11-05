const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

// Include your routes
const routes = require("./app/config/Routes");
app.use(routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
