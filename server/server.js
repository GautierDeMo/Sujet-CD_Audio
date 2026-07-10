require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cdRoutes = require("./Routes/cdRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", cdRoutes);

// Start listening only when run directly (node server.js), not when imported by tests
if (require.main === module) {
  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
}

module.exports = app;
