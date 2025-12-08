# 🚀 OptiRake DSS – Quick Start Guide

Welcome to OptiRake! This guide will help you get started in 2 minutes.

---

## 📍 What You're Seeing

OptiRake is a **Decision Support System** that automatically optimizes how you group customer orders onto train rakes (full train-loads).

**The system:**
- 📥 Takes in your pending orders
- 🧠 Analyzes inventory, routes, costs, deadlines
- 🚂 Suggests optimal rake groupings
- 💡 Explains why each decision was made
- ✅ Lets you approve and dispatch

---

## 🧭 The 6 Main Screens

### 1. **Rake Planner** (🚂) — START HERE
Your optimization plan for today. Click any rake to see why it was chosen.

**You'll see:**
- Cards showing each planned rake
- Badges: Utilization %, Cost, SLA Status, Risk Level
- Click "Details" → read the explanation → "Approve & Dispatch"

### 2. **Orders** (📦) — Review Customer Orders
See all pending orders + the best way to ship each one.

**You'll see:**
- Each customer order with quantity and deadline
- Priority (red = urgent, blue = low)
- Assigned mode (🚂 Rail or 🚚 Road)
- Click "See Best Fit" → read one-paragraph explanation

### 3. **Stockyards** (🏭) — Inventory Management
Real-time stock levels + bottleneck warnings.

**You'll see:**
- Material types and inventory at each location
- Usage bars (how full each yard is)
- Status: 🚨 Critical / ⚠️ High / ✅ Healthy
- Efficiency recommendations

### 4. **Optimization** (⚙️) — Run the Engine
Configure and run the optimization algorithm.

**How to use:**
- Adjust sliders: Cost Focus ↔ SLA Focus
- Adjust sliders: Min Utilization %
- Toggle: Multi-destination allowed (Yes/No)
- Click "Run Optimization"
- Watch status: "Checking inventory… Analyzing orders… Assigning rakes…"
- Results appear instantly

### 5. **Reports** (📈) — Today's Performance
KPI dashboard showing cost savings, utilization, on-time %.

**You'll see:**
- 4 big KPI cards (Cost Saved, Utilization, On-Time %, Demurrage Saved)
- Charts showing trends (last 6 days)
- Savings breakdown
- Export button (CSV)

### 6. **Settings** (⚙️) — Customize Behavior
Adjust how OptiRake optimizes for YOUR business.

**Configure:**
- Min Utilization % (40% = fast, 95% = efficient)
- Rail vs Road preference
- Risk tolerance (Conservative → Aggressive)
- Auto-dispatch (Yes/No)

---

## 💡 Typical Workflow (5 minutes)

1. **Open Rake Planner** → See "No plan yet? Run optimization"
2. **Go to Optimization** → Adjust settings if needed
3. **Click "Run Optimization"** → Wait 2-3 seconds
4. **Back to Rake Planner** → See planned rakes
5. **Click each rake** → Read explanation → Click "Approve"
6. **Check Reports** → See today's cost savings
7. **Done!** → All rakes ready to dispatch

---

## 🎯 Key Concepts (No Jargon)

| Concept | What It Means |
|---------|---------------|
| **Rake** | One full train-load of wagons (capacity ~950 tonnes) |
| **Wagon** | One cargo box on the train (capacity ~28 tonnes) |
| **Utilization %** | How full is the rake? (95% = almost full, 50% = half full) |
| **On-time %** | What % of orders arrived before customer deadline? |
| **SLA** | Service Level Agreement = customer deadline |
| **Demurrage** | Late penalty cost (₹/day) if delivery is late |
| **Cost Saved** | How much cheaper than "all by road" option |
| **Mode** | How to ship: 🚂 Rail (train) or 🚚 Road (truck) |
| **Multi-destination** | One rake serves multiple cities (Delhi → Ghaziabad) |

---

## ❓ Common Questions

### Q: Why should I use Rail over Road?
**A:** Rail is usually 20-30% cheaper for bulk cargo and better for the environment. OptiRake recommends rail whenever possible while still meeting your deadline.

### Q: What if my inventory is low?
**A:** Go to **Stockyards** → See bottleneck warnings. OptiRake will suggest what to produce next.

### Q: Can I change the optimization after it runs?
**A:** Yes! Go to **Optimization** → Change the sliders → Click "Run Optimization" again. No cost, instant results.

### Q: Why was my order assigned to this rake?
**A:** Go to **Orders** → Find your order → Click "See Best Fit" → Read the explanation. OptiRake always tells you why.

### Q: Is this system tracking my real rakes?
**A:** This is a prototype using sample SAIL data. In production, it would connect to your actual ERP system.

---

## 🎨 Visual Guide

### Color Meanings

| Color | Meaning |
|-------|---------|
| 🟢 Green | Good (On-time, Low risk, Healthy inventory) |
| 🟡 Yellow | Caution (At-risk, Moderate risk, Monitor) |
| 🔴 Red | Critical (Late, High risk, Low inventory) |
| 🔵 Blue | Information (Neutral) |

### Badge Meanings

| Badge | Meaning |
|-------|---------|
| ✅ On-time | Will arrive before deadline |
| ⚠️ At-Risk | Might arrive close to deadline |
| ❌ Late | Will arrive after deadline |
| 🟢 LOW risk | Delivery probability > 95% |
| 🟡 MEDIUM risk | Delivery probability 70-95% |
| 🔴 HIGH risk | Delivery probability < 70% |

---

## 🚀 Pro Tips

1. **Start with Defaults** → Use default settings for a week, then tweak based on results
2. **Check Stockyards Daily** → Watch for bottleneck warnings (red alerts)
3. **Read Explanations** → Every decision has a reason—OptiRake will tell you
4. **Export Reports** → Use CSV export to share with your team or boss
5. **Adjust Risk Tolerance** → If you want faster dispatch, lower Risk Tolerance. For cost savings, raise it.
6. **Monitor On-Time %** → If it drops below 90%, adjust your Optimization settings

---

## 📞 Support

If something doesn't make sense:
- **Hover over icons** → Tooltips explain each metric
- **Click "Details"** → Every decision has a detailed explanation
- **Read the explanation panel** → Plain English, no jargon
- **Check Settings** → Each setting has a description

---

## 🎬 Demo Scenario

Let's say you have 4 pending orders:

| Order | Customer | Quantity | Destination | Deadline |
|-------|----------|----------|-------------|----------|
| #001 | ABC Pipes | 28.5t | Delhi | Tomorrow 10am |
| #002 | XYZ Auto | 45.0t | Ghaziabad | Tomorrow 2pm |
| #003 | MNO Mills | 35.0t | Kanpur | In 3 days |
| #004 | PQR Trade | 15.5t | Pune | In 4 days |

**OptiRake will:**
1. Group #001 + #002 on same rake (both going to Delhi area, same deadline)
2. Put #003 on second rake (sufficient capacity, Kanpur is less urgent)
3. Put #004 on truck (road is fastest for Pune, not heavy load)

**Results:**
- ✅ 100% on-time delivery
- 💰 Cost saved: ₹5,000 vs sending each order separately
- ⏱️ Execution time: 2 seconds

---

## 🏁 You're Ready!

1. Open **Rake Planner**
2. Click "Run Optimization" (or go to **Optimization** tab)
3. Review the plan
4. Approve and dispatch

**Happy optimizing! 🚀**

---

*Made for the Smart India Hackathon – SAIL Rake Formation Optimization Challenge*
