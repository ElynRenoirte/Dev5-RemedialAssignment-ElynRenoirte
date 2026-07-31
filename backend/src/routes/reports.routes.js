const express = require("express");
const controller = require("../controllers/reports.controller");
const { validateId } = require("../middleware/validation");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validateId, controller.getById);
router.post("/", controller.create);

module.exports = router;
