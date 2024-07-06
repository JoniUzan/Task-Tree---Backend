const express = require("express");
const router = express.Router();
const {
  getUserTasks,
  deleteTaskById,
  updateTask,
  createTask,
  getTaskById,
} = require("../controllers/tasks-controller");

router.get("/", getUserTasks);
router.get("/details/:id", getTaskById);
router.post("/create", createTask);
router.delete("/:id", deleteTaskById);
router.patch("/:id", updateTask);

module.exports = router;
