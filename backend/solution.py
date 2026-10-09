"""
solution.py
-----------
0/1 Knapsack using Dynamic Programming for Student Scholarship Selection.

Mapping:
    Knapsack capacity  -> Available scholarship budget
    Item weight        -> Scholarship amount (integer rupees)
    Item value         -> Priority score

dp[i][b] = maximum priority score achievable using the first i students
           with a budget of b.

Recurrence:
    if amount > b:  dp[i][b] = dp[i-1][b]
    else:           dp[i][b] = max(dp[i-1][b], dp[i-1][b - amount] + priority)

Time Complexity : O(n x B)
Space Complexity: O(n x B)
(Pseudo-polynomial: depends on the numeric value of the budget B.)
"""

from math import gcd


def find_money_unit(budget, students):
    """
    Optimization for the prototype: divide all amounts by their common
    divisor (for example Rs.10,000) so the DP table becomes much smaller.
    This does NOT change the answer because every amount is divided exactly.
    """
    unit = budget
    for student in students:
        unit = gcd(unit, student["amount"])
    return unit if unit > 0 else 1


def knapsack_scholarship(budget, students):
    """
    Returns a dictionary with selected students, unselected students and totals.
    students: list of {"name": str, "amount": int, "priority": int}
    """
    n = len(students)

    # Step 0: scale money into bigger units to reduce table size.
    unit = find_money_unit(budget, students)
    capacity = budget // unit
    weights = [s["amount"] // unit for s in students]
    values = [s["priority"] for s in students]

    # Step 1: create DP table of size (n+1) x (capacity+1), filled with 0.
    # Base condition: dp[0][b] = 0 (no students) and dp[i][0] = 0 (no budget).
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    # Step 2: fill the table row by row.
    for i in range(1, n + 1):
        amount = weights[i - 1]
        priority = values[i - 1]
        for b in range(capacity + 1):
            # Option 1: do NOT select student i
            dp[i][b] = dp[i - 1][b]
            # Option 2: select student i (only if it fits in budget b)
            if amount <= b:
                with_student = dp[i - 1][b - amount] + priority
                if with_student > dp[i][b]:
                    dp[i][b] = with_student

    # Step 3: backtrack to find WHICH students were selected.
    selected_flags = [0] * n
    b = capacity
    for i in range(n, 0, -1):
        if dp[i][b] != dp[i - 1][b]:
            selected_flags[i - 1] = 1          # student i was selected
            b -= weights[i - 1]

    selected = [students[i] for i in range(n) if selected_flags[i] == 1]
    unselected = [students[i] for i in range(n) if selected_flags[i] == 0]

    total_amount = sum(s["amount"] for s in selected)
    total_priority = sum(s["priority"] for s in selected)

    # Safety check: the budget must never be exceeded.
    assert total_amount <= budget

    return {
        "selected_students": selected,
        "unselected_students": unselected,
        "total_budget": budget,
        "total_amount": total_amount,
        "remaining_budget": budget - total_amount,
        "total_priority": total_priority,
        "selected_count": len(selected),
        "dp_table_size": f"{n + 1} x {capacity + 1}",
        "money_unit": unit,
    }


if __name__ == "__main__":
    demo = [
        {"name": "Rahul", "amount": 50000, "priority": 90},
        {"name": "Anjali", "amount": 30000, "priority": 70},
        {"name": "Kiran", "amount": 40000, "priority": 80},
        {"name": "Priya", "amount": 20000, "priority": 60},
    ]
    print(knapsack_scholarship(100000, demo))
