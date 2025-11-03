const express = require("express");

const batteryController = require("../controllers/batteryControllers");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/data", authenticate, batteryController.postBatteryData);

router.get("/all", authenticate, batteryController.getBatteryData);

router.get("/:id", authenticate, batteryController.getBatteryDataById);

router.get("/:id/:field", authenticate, batteryController.getBatteryFieldData);

module.exports = router;
