# ⚡ Smart Urgency & Priority Mix Algorithm

## Overview
The **Smart Urgency & Priority Mix Algorithm** solves the problem of simple static sorting (where an "Urgent" task due in 3 weeks hides an overdue "Medium" task due 2 hours ago). It calculates a dynamic, real-time priority score $S(t) \in [0, 100+]$ for every task by balancing:
1. **Declared Priority Weight ($W_p$)**
2. **Deadline Proximity & Exponential Overdue Urgency ($F_d(t)$)**
3. **Starvation Prevention / Task Age ($F_a(t)$)**
4. **Subtask Completion Momentum Bonus ($F_s$)**
5. **Completed Item Deprecation Penalty ($M_c$)**

---

## 🧮 Mathematical Formulation

$$S(t) = M_c \times \left( W_p + F_d(t) + F_a(t) + F_s \right)$$

### 1. Base Priority Weight ($W_p$)
Reflects user-assigned importance:
- **Urgent**: $+45$ points
- **High**: $+30$ points
- **Medium**: $+18$ points
- **Low**: $+8$ points

---

### 2. Deadline Urgency Factor ($F_d(t)$)
Let $T_{rem} = \frac{T_{deadline} - T_{now}}{3600 \text{ sec}}$ (Hours remaining until deadline).

$$\begin{cases}
T_{rem} < 0 \quad (\text{Overdue}) & \implies 55 + \min(35, |T_{rem}| \times 1.5) \\
0 \le T_{rem} \le 6 \quad (\text{Critical} \le 6\text{h}) & \implies 42 \times \left(1 - \frac{T_{rem}}{6}\right) + 15 \\
6 < T_{rem} \le 24 \quad (\text{Today} \le 24\text{h}) & \implies 32 \times \left(1 - \frac{T_{rem}}{24}\right) + 10 \\
24 < T_{rem} \le 72 \quad (\le 3\text{ days}) & \implies 20 \times \left(1 - \frac{T_{rem}}{72}\right) + 5 \\
72 < T_{rem} \le 168 \quad (\le 7\text{ days}) & \implies 10 \times \left(1 - \frac{T_{rem}}{168}\right) \\
T_{rem} > 168 \text{ or No Deadline} & \implies 2 \text{ points}
\end{cases}$$

---

### 3. Starvation Prevention / Task Age Factor ($F_a(t)$)
To prevent older, lower-priority tasks from lingering indefinitely at the bottom of the list:
$$F_a(t) = \min\left(8, \text{Age in Days} \times 1.2\right)$$

---

### 4. Subtask Completion Momentum Bonus ($F_s$)
If a task has subtasks and is partially completed ($0 < \text{Progress} < 1$), give $+5$ points to encourage the user to finish the remaining steps.

---

### 5. Completed Item Penalty ($M_c$)
- If $\text{isCompleted} == \text{true}$: Score is fixed at **$-1000$**, sinking it below all active tasks.

---

## 📊 Score Classification Tiers

| Score Range | Urgency Tier | Badge Visual | Recommended Action |
|:---|:---|:---|:---|
| **$85+$** | `OVERDUE` | 🔴 Red Glowing Border | Immediate Action Required |
| **$65 - 84$** | `CRITICAL` | 🌸 Rose Badge | Due within 6 hours / High priority |
| **$40 - 64$** | `NEAR_DEADLINE` | 🟠 Amber Badge | Due today / Next 48 hours |
| **$20 - 39$** | `UPCOMING` | 🔵 Blue Badge | On track for this week |
| **$< 20$** | `ON_TRACK` | 🟢 Emerald / Slate | Backlog / Long-term |
| **$-1000$** | `COMPLETED` | ✅ Strikethrough | Archived / Done |

---

## 🧪 Verification & Test Proof
Run the automated test suite verifying this formula:
```bash
npm run test:backend
```
Result: **7 / 7 test cases passed** (Overdue ranking, imminent boost, completion penalty, array sorting).
