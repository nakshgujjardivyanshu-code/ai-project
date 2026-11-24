import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api.js";

const categories = ["Food", "Transport", "Housing", "Utilities", "Health", "Entertainment", "Shopping", "Other"];
const emptyForm = { title: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10) };

function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
}

function getLocalDate(date) {
  const parsed = new Date(date);
  return new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadExpenses() {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get("/api/expenses");
      setExpenses(data);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        handleLogout();
        return;
      }
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
    // Load the list once when the dashboard opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/expenses/${editingId}`, form);
      } else {
        await api.post("/api/expenses", form);
      }
      setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
      setEditingId("");
      await loadExpenses();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  function startEditing(expense) {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      date: getLocalDate(expense.date),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId("");
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
  }

  async function deleteExpense(id) {
    if (!window.confirm("Delete this expense? This cannot be undone.")) return;
    setError("");
    try {
      await api.delete(`/api/expenses/${id}`);
      setExpenses((current) => current.filter((expense) => expense._id !== id));
      if (editingId === id) cancelEditing();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  const visibleExpenses = useMemo(
    () => (filter === "All" ? expenses : expenses.filter((expense) => expense.category === filter)),
    [expenses, filter]
  );
  const total = visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <a className="wordmark" href="/dashboard"><span className="brand-mark small">$</span> Expense Tracker</a>
        <div className="topbar-user">
          <span className="welcome">Hi, {user.name || "there"}</span>
          <button className="button outline" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">YOUR MONEY, CLEARER</p>
            <h1>Expenses</h1>
            <p className="muted">Add and review your spending in one place.</p>
          </div>
          <div className="total-card">
            <span>{filter === "All" ? "Total expenses" : `${filter} total`}</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </section>

        {error && <p className="notice error page-notice" role="alert">{error}</p>}

        <section className="panel expense-form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{editingId ? "UPDATE DETAILS" : "NEW ENTRY"}</p>
              <h2>{editingId ? "Edit expense" : "Add an expense"}</h2>
            </div>
          </div>
          <form className="expense-form" onSubmit={handleSubmit}>
            <label className="title-field">
              Title
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="e.g. Weekly groceries"
                maxLength="100"
                required
              />
            </label>
            <label>
              Amount
              <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={updateField} placeholder="0.00" required />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={updateField} required>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Date
              <input name="date" type="date" value={form.date} onChange={updateField} required />
            </label>
            <div className="form-actions">
              <button className="button primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add expense"}
              </button>
              {editingId && <button className="button outline" type="button" onClick={cancelEditing}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="list-heading">
            <div>
              <p className="eyebrow">ACTIVITY</p>
              <h2>Recent expenses</h2>
            </div>
            <label className="filter-control">
              <span>Category</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option>All</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
          </div>

          {loading ? (
            <p className="empty-state">Loading your expenses...</p>
          ) : visibleExpenses.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">↗</span>
              <h3>{filter === "All" ? "Nothing here yet" : `No ${filter.toLowerCase()} expenses`}</h3>
              <p>{filter === "All" ? "Your expenses will show up here after you add one." : "Try another category or add a new expense."}</p>
            </div>
          ) : (
            <div className="expense-list">
              {visibleExpenses.map((expense) => (
                <article className="expense-row" key={expense._id}>
                  <div className="expense-symbol" aria-hidden="true">{expense.title.charAt(0).toUpperCase()}</div>
                  <div className="expense-description">
                    <strong>{expense.title}</strong>
                    <span>{expense.category} · {new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <strong className="expense-amount">{formatCurrency(expense.amount)}</strong>
                  <div className="row-actions">
                    <button className="text-button" type="button" onClick={() => startEditing(expense)} aria-label={`Edit ${expense.title}`}>Edit</button>
                    <button className="text-button delete-button" type="button" onClick={() => deleteExpense(expense._id)} aria-label={`Delete ${expense.title}`}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <footer className="footer-note">Your expense details are private to your account.</footer>
      </div>
    </main>
  );
}
