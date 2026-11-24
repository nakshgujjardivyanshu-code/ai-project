const mongoose = require("mongoose");

const categories = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Health",
  "Entertainment",
  "Shopping",
  "Other",
];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please enter an expense title."],
      trim: true,
      maxlength: [100, "Title must be 100 characters or fewer."],
    },
    amount: {
      type: Number,
      required: [true, "Please enter an amount."],
      min: [0.01, "Amount must be greater than zero."],
    },
    category: {
      type: String,
      required: [true, "Please choose a category."],
      enum: {
        values: categories,
        message: "Please choose a valid category.",
      },
    },
    date: {
      type: Date,
      required: [true, "Please choose a date."],
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
