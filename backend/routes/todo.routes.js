
const express = require("express");

const {
  createTodo,
  fetchAllTodos,
  deleteTodo,
  updateTodo,
} = require("../controllers/todo.controller");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTodo);
router.get("/", authMiddleware, fetchAllTodos);
router.delete("/:id", authMiddleware, deleteTodo);
router.put("/:id", authMiddleware, updateTodo);

module.exports = router;
