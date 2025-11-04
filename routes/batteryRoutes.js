const express = require("express");

const {
  postBatteryData,
  getBatteryData,
  getBatteryDataById,
  getBatteryFieldData,
} = require("../controllers/batteryControllers");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/data", authenticate, postBatteryData);

router.get("/all", authenticate, getBatteryData);

router.get("/:id", authenticate, getBatteryDataById);

router.get("/:id/:field", authenticate, getBatteryFieldData);

module.exports = router;
