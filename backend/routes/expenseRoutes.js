const express = require("express");
const {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").get(getExpenses).post(createExpense);
router.route("/:id").put(updateExpense).delete(deleteExpense);

module.exports = router;
