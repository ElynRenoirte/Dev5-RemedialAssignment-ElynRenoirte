//defines URL's (endpoints) for reports and connects each URL to the correct controller function
const express = require("express");
const controller = require("../controllers/reports.controller");
const { validateId } = require("../middleware/validation");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/stats", controller.getStats);
router.get("/:id", validateId, controller.getById);
router.post("/", controller.create);

module.exports = router;
