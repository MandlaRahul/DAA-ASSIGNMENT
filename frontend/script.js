const API_URL = "http://localhost:5000/api/optimize";
let students = [];

function formatRupees(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

function showMessage(elementId, text, type) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = "message " + (type || "");
}

function updateStudentCounter() {
  const counter = document.getElementById("studentCounter");
  counter.textContent = `${students.length} student${students.length === 1 ? "" : "s"}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderStudentTable() {
  const tbody = document.getElementById("studentTable");
  updateStudentCounter();

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">No students added yet. Start by entering your first applicant.</td></tr>';
    return;
  }

  tbody.innerHTML = students
    .map((s, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${formatRupees(s.amount)}</td>
        <td>${s.priority}</td>
        <td><button class="btn btn-danger btn-small" type="button" onclick="removeStudent(${index})">Remove</button></td>
      </tr>`)
    .join("");
}

function addStudent() {
  const nameInput = document.getElementById("name");
  const amountInput = document.getElementById("amount");
  const priorityInput = document.getElementById("priority");

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const priority = Number(priorityInput.value);

  if (name === "") {
    showMessage("formMessage", "Student name cannot be empty.", "error");
    nameInput.focus();
    return;
  }

  if (amountInput.value === "" || !Number.isInteger(amount) || amount <= 0) {
    showMessage("formMessage", "Scholarship amount must be a positive whole number.", "error");
    amountInput.focus();
    return;
  }

  if (priorityInput.value === "" || !Number.isInteger(priority) || priority < 0) {
    showMessage("formMessage", "Priority score must be a non-negative whole number.", "error");
    priorityInput.focus();
    return;
  }

  students.push({ name, amount, priority });
  renderStudentTable();
  showMessage("formMessage", `${name} was added successfully.`, "success");

  nameInput.value = "";
  amountInput.value = "";
  priorityInput.value = "";
  nameInput.focus();
}

function removeStudent(index) {
  students.splice(index, 1);
  renderStudentTable();
  if (students.length === 0) {
    showMessage("formMessage", "List cleared. Add a new student to continue.", "success");
  }
}

function clearAll() {
  students = [];
  document.getElementById("budget").value = "";
  document.getElementById("resultSection").classList.add("hidden");
  showMessage("formMessage", "");
  showMessage("apiMessage", "");
  renderStudentTable();
}

function loadSample() {
  document.getElementById("budget").value = 100000;
  students = [
    { name: "Rahul", amount: 50000, priority: 90 },
    { name: "Anjali", amount: 30000, priority: 70 },
    { name: "Kiran", amount: 40000, priority: 80 },
    { name: "Priya", amount: 20000, priority: 60 },
    { name: "Arjun", amount: 25000, priority: 55 },
    { name: "Sneha", amount: 15000, priority: 45 },
  ];
  renderStudentTable();
  showMessage("formMessage", "Sample data loaded.", "success");
}

function fillResultTable(tbodyId, list, emptyText) {
  const tbody = document.getElementById(tbodyId);
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty">${emptyText}</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map((s) => `
      <tr>
        <td>${escapeHtml(s.name)}</td>
        <td>${formatRupees(s.amount)}</td>
        <td>${s.priority}</td>
      </tr>`)
    .join("");
}

function showResult(result) {
  document.getElementById("sumBudget").textContent = formatRupees(result.total_budget);
  document.getElementById("sumUsed").textContent = formatRupees(result.total_amount);
  document.getElementById("sumRemaining").textContent = formatRupees(result.remaining_budget);
  document.getElementById("sumPriority").textContent = result.total_priority;
  document.getElementById("sumCount").textContent = result.selected_count;
  document.getElementById("dpInfo").textContent =
    `The backend computed a DP table sized ${result.dp_table_size} using a money unit of ${formatRupees(result.money_unit)}.`;

  fillResultTable("selectedTable", result.selected_students, "No student fits the current budget.");
  fillResultTable("unselectedTable", result.unselected_students, "All students are selected.");

  const section = document.getElementById("resultSection");
  section.classList.remove("hidden");
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function calculateSelection() {
  const budgetValue = document.getElementById("budget").value;
  const budget = Number(budgetValue);

  if (budgetValue === "" || !Number.isInteger(budget) || budget < 0) {
    showMessage("apiMessage", "Please enter a valid budget (whole number, 0 or more).", "error");
    document.getElementById("budget").focus();
    return;
  }

  if (students.length === 0) {
    showMessage("apiMessage", "Please add at least one student before calculating.", "error");
    return;
  }

  const data = { budget, students };
  const button = document.getElementById("calculateBtn");
  button.disabled = true;
  button.textContent = "Calculating...";
  showMessage("apiMessage", "");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!response.ok) {
      showMessage("apiMessage", "Error: " + (result.error || "Something went wrong."), "error");
      return;
    }

    showMessage("apiMessage", "Optimal selection calculated successfully.", "success");
    showResult(result);
  } catch (error) {
    showMessage(
      "apiMessage",
      "Unable to connect to the backend. Run the Flask server in the backend folder first.",
      "error"
    );
  } finally {
    button.disabled = false;
    button.textContent = "Calculate optimal selection";
  }
}

document.getElementById("studentForm").addEventListener("submit", (event) => {
  event.preventDefault();
  addStudent();
});

document.getElementById("clearBtn").addEventListener("click", clearAll);
document.getElementById("sampleBtn").addEventListener("click", loadSample);
document.getElementById("calculateBtn").addEventListener("click", calculateSelection);

document.getElementById("priority").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addStudent();
  }
});

renderStudentTable();
