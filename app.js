const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

const db = require("./config/pgConfig");
const app = express();
app.use(express.json());

const batteryRoutes = require("./routes/batteryRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/battery", batteryRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BMS API is running",
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `${process.env.NODE_ENV} server running at port ${process.env.PORT}`
  );
});
