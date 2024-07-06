const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user-controller");

router.get("/", getUserById);

module.exports = router;
