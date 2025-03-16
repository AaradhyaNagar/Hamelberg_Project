const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");
const PORT = 8000;
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const atlasPass = process.env.ATLAS_PASS;
const atlasDbName = "Hamelberg_Project";

const atlasURL = `mongodb+srv://aaradhyanagar12:${atlasPass}@cluster0.x0xjk.mongodb.net/${atlasDbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to Atlas
mongoose
  .connect(atlasURL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const { handleUnReachableRoutes } = require("./middlewares/index");

const { staticRouter } = require("./routes/staticRouter");
const { publicationsRouter } = require("./routes/publication");

app.set("view engine", "ejs");

// This allows the render method to look for templates in both views and views/partials.
app.set("views", [path.resolve("./views"), path.resolve("./views/partials")]);

app.use("/", staticRouter);

app.use(handleUnReachableRoutes);

app.listen(PORT, () => {
  console.log("Hemlo from PORT :", PORT);
});
