const express = require("express");
const controller = require("../controllers/users.controller");
const { validateId } = require("../middleware/validation");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validateId, controller.getById);
router.post("/", controller.create);
router.get("/:id/reports", validateId, controller.getReports);

module.exports = router;
