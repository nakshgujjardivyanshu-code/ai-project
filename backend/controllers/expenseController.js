const mongoose = require("mongoose");
const Expense = require("../models/Expense");

function validateId(id) {
  return mongoose.isValidObjectId(id);
}

async function getExpenses(req, res, next) {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
    return res.json(expenses);
  } catch (error) {
    return next(error);
  }
}

async function createExpense(req, res, next) {
  try {
    const { title, amount, category, date } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Please enter an expense title." });
    }
    if (amount === undefined || amount === "" || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be a number greater than zero." });
    }
    if (!category) {
      return res.status(400).json({ message: "Please choose a category." });
    }
    if (date && Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Please enter a valid date." });
    }

    const expense = await Expense.create({
      user: req.userId,
      title,
      amount: Number(amount),
      category,
      ...(date ? { date } : {}),
    });
    return res.status(201).json(expense);
  } catch (error) {
    return next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense ID." });
    }

    const { title, amount, category, date } = req.body;
    if (title !== undefined && (typeof title !== "string" || !title.trim() || title.trim().length > 100)) {
      return res.status(400).json({ message: "Title must be between 1 and 100 characters." });
    }
    if (amount !== undefined && (amount === "" || !Number.isFinite(Number(amount)) || Number(amount) <= 0)) {
      return res.status(400).json({ message: "Amount must be a number greater than zero." });
    }
    if (date !== undefined && Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Please enter a valid date." });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (amount !== undefined) updates.amount = Number(amount);
    if (category !== undefined) updates.category = category;
    if (date !== undefined) updates.date = date;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }
    return res.json(expense);
  } catch (error) {
    return next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense ID." });
    }

    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }
    return res.json({ message: "Expense deleted." });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
