# Algorithm Documentation – 0/1 Knapsack for Scholarship Selection

## 1. Problem Definition
Given a budget B and n students, where student i needs amount `a[i]` and has priority `p[i]`, choose a subset of students such that:
- total amount ≤ B
- total priority is maximum
Each student is taken fully or not at all.

## 2. Knapsack Mapping
| Knapsack term | Our problem |
|---|---|
| Knapsack capacity | Scholarship budget |
| Item | Student |
| Weight | Scholarship amount |
| Value | Priority score |
| x[i] ∈ {0,1} | Selected / not selected |

## 3. Dynamic Programming Concept
Trying every subset takes O(2^n) time. DP breaks the problem into smaller subproblems ("best answer using first i students with budget b"), stores each answer in a table, and reuses it. This works because the problem has **optimal substructure** and **overlapping subproblems**.

## 4. DP State
`dp[i][b]` = maximum priority score achievable using the first `i` students with budget `b`.

## 5. Recurrence Relation
```
if amount_i > b:
    dp[i][b] = dp[i-1][b]
else:
    dp[i][b] = max( dp[i-1][b],                       // skip student i
                    dp[i-1][b - amount_i] + priority_i ) // select student i
```

## 6. Base Condition
- `dp[0][b] = 0` for all b (no students → no priority)
- `dp[i][0] = 0` for all i (no budget → nobody selected)

## 7. Table Construction
Rows = students (0..n), columns = budget (0..B). Fill row by row, left to right. Each cell only needs values from the previous row.

## 8. Backtracking / Solution Reconstruction
Start at `dp[n][B]`. For i = n down to 1:
- If `dp[i][b] != dp[i-1][b]`, student i was selected → `b = b - amount_i`.
- Otherwise student i was not selected.

## 9. Time Complexity
There are (n+1)(B+1) cells and each takes O(1) → **O(n × B)**.
It is **pseudo-polynomial**: it depends on the value of B. For a big rupee budget we convert money to units (e.g. ₹1000 or the GCD of all amounts) so that B becomes small. Example: ₹1,00,000 with unit ₹10,000 → B = 10.

## 10. Space Complexity
The 2D table uses **O(n × B)** memory. (A 1D array can reduce it to O(B), but we keep 2D because it makes backtracking easy to explain.)

## 11. Example Walkthrough
Budget = 100000, unit = 10000 → B = 10.

| i | Student | Weight | Value |
|---|---|---|---|
| 1 | Rahul | 5 | 90 |
| 2 | Anjali | 3 | 70 |
| 3 | Kiran | 4 | 80 |
| 4 | Priya | 2 | 60 |

DP table (rows i, columns b = 0..10):
```
b:        0   1   2   3   4   5   6   7   8   9   10
i=0       0   0   0   0   0   0   0   0   0   0    0
i=1 R     0   0   0   0   0  90  90  90  90  90   90
i=2 A     0   0   0  70  70  90  90  90 160 160  160
i=3 K     0   0   0  70  80  90  90 150 160 170  170
i=4 P     0   0  60  70  80 130 140 150 160 210  220
```
Backtracking from dp[4][10] = 220:
- dp[4][10]=220 ≠ dp[3][10]=170 → Priya selected, b = 8
- dp[3][8]=160 = dp[2][8]=160 → Kiran not selected
- dp[2][8]=160 ≠ dp[1][8]=90 → Anjali selected, b = 5
- dp[1][5]=90 ≠ dp[0][5]=0 → Rahul selected, b = 0

Selected: Rahul, Anjali, Priya → ₹1,00,000, priority 220.

## Pseudocode
```
KNAPSACK(students, budget):
    n = number of students
    create dp[n+1][budget+1]
    for i = 0 to n:
        dp[i][0] = 0
    for i = 1 to n:
        for b = 0 to budget:
            amount = students[i-1].amount
            priority = students[i-1].priority
            if amount <= b:
                dp[i][b] = max(dp[i-1][b], dp[i-1][b-amount] + priority)
            else:
                dp[i][b] = dp[i-1][b]
    selected = empty list
    b = budget
    for i = n down to 1:
        if dp[i][b] != dp[i-1][b]:
            add students[i-1] to selected
            b = b - students[i-1].amount
    return selected
```
