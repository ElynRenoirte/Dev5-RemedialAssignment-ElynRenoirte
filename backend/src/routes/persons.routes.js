//defines URL's (endpoints) for persons and connects each URL to the correct controller function
const express = require("express");
const controller = require("../controllers/persons.controller");
const { validateId } = require("../middleware/validation");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validateId, controller.getById);
router.post("/", controller.create);
router.get("/:id/trajectory", validateId, controller.getTrajectory);

module.exports = router;
