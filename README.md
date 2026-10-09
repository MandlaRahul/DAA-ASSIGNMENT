# Student Scholarship Selection

## 1. Problem Statement
A university has a limited scholarship budget. Many students apply. Each student needs a fixed scholarship amount and has a priority score (based on academic performance and financial need). The budget is not enough for everyone, so we must choose the best group of students.

## 2. Objective
Maximize the total student priority score without exceeding the available scholarship budget.

## 3. Algorithm Used
0/1 Knapsack using Dynamic Programming.

## 4. Why 0/1 Knapsack?
Each student can either receive the full scholarship (1) or not receive it (0).
A student cannot receive a partial scholarship in this model, so fractional knapsack / greedy is not suitable.

| Knapsack | Scholarship problem |
|---|---|
| Capacity | Available budget |
| Item | Student |
| Weight | Scholarship amount |
| Value | Priority score |

## 5. Input
- Available budget
- Student name
- Scholarship amount (integer rupees)
- Priority score (integer)

## 6. Output
- Selected students
- Unselected students
- Total amount used
- Remaining budget
- Total priority score

## 7. Algorithm
1. Create a table `dp[n+1][B+1]` filled with 0.
   `dp[i][b]` = maximum priority score using the first `i` students with budget `b`.
2. For every student `i` and every budget `b`:
   - If amount > b: `dp[i][b] = dp[i-1][b]` (cannot select)
   - Else: `dp[i][b] = max(dp[i-1][b], dp[i-1][b-amount] + priority)`
3. The answer (max priority) is `dp[n][B]`.
4. Backtrack from `i = n, b = B`: if `dp[i][b] != dp[i-1][b]`, student `i` was selected, so reduce `b` by its amount.
5. Students not selected go into the unselected list.

Small optimization: all amounts and the budget are divided by their GCD (for example ₹10,000) before building the table. This gives the exact same answer with a much smaller table.

## 8. Complexity
Time Complexity: **O(n × B)**
Space Complexity: **O(n × B)**

n = number of students, B = budget (in money units). This is **pseudo-polynomial** because it depends on the numeric value of B, not just the input size.

## 9. Project Structure
```
DAA-Hackathon-Team/
├── README.md
├── frontend/      index.html, style.css, script.js
├── backend/       app.py, solution.py, requirements.txt
├── test/          test_cases.txt
├── docs/          algorithm.md
└── presentation/  presentation.pptx
```

## 10. How to Run
Backend:
```
cd backend
pip install -r requirements.txt
python app.py
```
The API runs at `http://localhost:5000/api/optimize`.

Frontend:
Open `frontend/index.html` in a browser.

If the browser blocks the request, run a simple local server:
```
cd frontend
python -m http.server 8000
```
then open `http://localhost:8000`.

## 11. Example
Budget = ₹1,00,000

| Student | Amount | Priority |
|---|---|---|
| Rahul | 50000 | 90 |
| Anjali | 30000 | 70 |
| Kiran | 40000 | 80 |
| Priya | 20000 | 60 |

Result: **Rahul, Anjali, Priya** selected. Amount used ₹1,00,000, remaining ₹0, total priority **220**. Kiran is not selected.

API request:
```json
POST /api/optimize
{ "budget": 100000, "students": [ { "name": "Rahul", "amount": 50000, "priority": 90 } ] }
```

## 12. Future Improvements
- Login system
- Database
- Student eligibility verification
- Admin dashboard
- Multiple scholarship categories
- Real university student data
- Advanced optimization algorithms (branch and bound, space-optimized DP)
