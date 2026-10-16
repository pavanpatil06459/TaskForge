
const Todo = require("../models/todo.model");

const allowedPriorities = ["Low", "Medium", "High"];

// Create Todo
exports.createTodo = async (req, res) => {
  try {
    const { title, date, priority } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Todo title is required",
      });
    }

    // Validate priority if provided
    if (
      priority !== undefined &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        message: "Priority must be Low, Medium, or High",
      });
    }

    const newTodo = new Todo({
      title: title.trim(),
      endDate: date,
      priority: priority ?? "Medium",
      userId: req.user.userId,
    });

    await newTodo.save();

    res.status(201).json({
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (error) {
    console.error("Create Todo error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Fetch only logged-in user's Todos
exports.fetchAllTodos = async (req, res) => {
  try {
    const todoArray = await Todo.find({
      userId: req.user.userId,
    }).sort({ _id: -1 });

    res.status(200).json(todoArray);
  } catch (error) {
    console.error("Fetch Todos error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Update only logged-in user's Todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, priority } = req.body;

    const updateFields = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Todo title cannot be empty",
        });
      }

      updateFields.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be true or false",
        });
      }

      updateFields.completed = completed;
    }

    if (priority !== undefined) {
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Priority must be Low, Medium, or High",
        });
      }

      updateFields.priority = priority;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to update",
      });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.userId,
      },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Update Todo error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Delete only logged-in user's Todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!deletedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete Todo error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
