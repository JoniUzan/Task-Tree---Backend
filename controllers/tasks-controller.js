const Task = require("../models/task-model");
const User = require("../models/user-model");

async function getUserTasks(req, res) {
  const { userId } = req.userId;

  try {
    const tasks = await Task.find({
      user: userId,
    });

    res.status(200).json(tasks);
  } catch (err) {
    if (err.name === "CastError") {
      console.log(
        `tasks-controller, getUserTasks. Tasks not found with user id: ${userId}`
      );
      return res.status(404).json({ message: "Tasks not found" });
    }
    console.log(
      `tasks-controller, getUserTasks. Error while getting Tasks with user id: ${userId}`,
      err.name
    );
    res.status(500).json({ message: err.message });
  }
}


async function getTaskById(req, res) {
    const { id } = req.params;
    try {
      const task = await Task.findById(id);
      res.status(200).json(task);
    } catch (err) {
      if (err.name === "CastError") {
        console.log(
          `tasks-controller, getTaskById. Task not found with id: ${id}`
        );
        return res.status(404).json({ message: "Task not found" });
      }
      console.log(
        `tasks-controller, getTaskById. Error while getting Task with id: ${id}`,
        err.name
      );
      res.status(500).json({ message: err.message });
    }
  }


  async function deleteTaskById(req, res) {
    const { id } = req.params;

    try {
      const deletedTask = await Task.findOneAndDelete({
        _id: id,
        user: req.userId,
      });

      if (!deletedTask) {
        console.log(
          `tasks-controller, deleteTask. Task not found with id: ${id}`
        );
        return res.status(404).json({ message: "Task not found" });
      }
      // Update the user's task array
      await User.findByIdAndUpdate(req.userId, {
        $pull: { tasks: id }, // Remove the task id from the user's products array
      });
      res.json({ message: "Task deleted" });
    } catch (err) {
      console.log(
        `tasks-controller, deleteTask. Error while deleting task with id: ${id}`
      );
      res.status(500).json({ message: err.message });
    }
  }

// Update Product
async function updateTask(req, res) {
  const { id } = req.params;
  const newTask = req.body;
  console.log("req user id", req.userId);
  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.userId,
      },
      newTask,
      { new: true, runValidators: true } // validate before updating
    );

    console.log("updatedTask", updatedTask);

    if (!updatedTask) {
      console.log(`tasks-controler, updateTask. Task not found with id: ${id}`);
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.log(
      `tasks-controler, updateTask. Error while updating Task with id: ${id}`,
      err
    );

    if (err.name === "ValidationError") {
      // Mongoose validation error
      console.log(`tasks-controler, updateTask. ${err.message}`);
      res.status(400).json({ message: err.message });
    } else {
      // Other types of errors
      console.log(`tasks-controler, updateTask. ${err.message}`);
      res.status(500).json({ message: "Server error while updating task" });
    }
  }
}

// Create new Product
async function createTask(req, res) {
  try {
    const newTask = new Task(req.body);
    newTask.user = req.userId; // Add the user id to the product
    const savedTask = await newTask.save();
    console.log(savedTask);
    // Update the user's product array
    await User.findByIdAndUpdate(req.userId, {
      $push: { tasks: savedTask._id }, // Add the product id to the user's products array
    });

    res.status(201).json(savedTask);
  } catch (err) {
    console.log("tasks-controler, createTask. Error while creating task", err);

    if (err.name === "ValidationError") {
      // Mongoose validation error
      console.log(`tasks-controler, createTask. ${err.message}`);
      res.status(400).json({ message: err.message });
    } else {
      // Other types of errors
      console.log(`tasks-controler, createTask. ${err.message}`);
      res.status(500).json({ message: "Server error while creating task" });
    }
  }
}

module.exports = { getUserTasks, deleteTaskById, updateTask, createTask,getTaskById };
