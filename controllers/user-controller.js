const User = require("../models/user-model");

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.userId);
    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    if (err.name === "CastError") {
      console.log(
        `user-controler, getUsertById. User not found with id: ${id}`
      );
      return res.status(404).json({ message: "User not found" });
    }
    console.log(
      `user-controler, getUsertById. Error while getting User with id: ${id}`,
      err.name
    );
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getUserById };
