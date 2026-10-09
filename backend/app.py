"""
app.py - Flask REST API for Student Scholarship Selection.
Run:  python app.py   (server starts at http://localhost:5000)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from solution import knapsack_scholarship

app = Flask(__name__)
CORS(app)  # allow the frontend (opened from file or another port) to call the API

MAX_BUDGET = 100_000_000  # Rs.10 crore safety limit for the prototype


def is_integer(value):
    # bool is a subclass of int in Python, so exclude it explicitly
    return isinstance(value, int) and not isinstance(value, bool)


def validate_input(data):
    """Returns (budget, students, error_message)."""
    if not isinstance(data, dict):
        return None, None, "Request body must be a JSON object."

    budget = data.get("budget")
    students = data.get("students")

    if not is_integer(budget):
        return None, None, "Budget must be a whole number (integer rupees)."
    if budget < 0:
        return None, None, "Budget must be greater than or equal to 0."
    if budget > MAX_BUDGET:
        return None, None, "Budget is too large for this prototype (max Rs.10,00,00,000)."

    if not isinstance(students, list):
        return None, None, "Students must be a list."
    if len(students) == 0:
        return None, None, "Please add at least one student."

    clean_students = []
    for index, student in enumerate(students, start=1):
        if not isinstance(student, dict):
            return None, None, f"Student {index} is not valid."

        name = str(student.get("name", "")).strip()
        amount = student.get("amount")
        priority = student.get("priority")

        if name == "":
            return None, None, f"Student {index}: name cannot be empty."
        if not is_integer(amount) or amount <= 0:
            return None, None, f"Student '{name}': scholarship amount must be a positive whole number."
        if not is_integer(priority) or priority < 0:
            return None, None, f"Student '{name}': priority score must be a non-negative whole number."

        clean_students.append({"name": name, "amount": amount, "priority": priority})

    return budget, clean_students, None


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Student Scholarship Selection API is running."})


@app.route("/api/optimize", methods=["POST"])
def optimize():
    data = request.get_json(silent=True)
    budget, students, error = validate_input(data)
    if error:
        return jsonify({"error": error}), 400

    result = knapsack_scholarship(budget, students)
    return jsonify(result), 200


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
