//defines URL's (endpoints) for categories and connects each URL to the correct controller function
const express = require("express");
const controller = require("../controllers/categories.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", controller.create);

module.exports = router;
