# OptiRake DSS — Data Schema Guide

## Overview

OptiRake DSS is a simplified rake formation optimizer for SAIL steel plants. It takes customer orders and optimally assigns them to rakes (trains) while considering material compatibility, wagon capacity, delivery deadlines, and cost efficiency.

**Key Principle:** Simple, fast, and understandable. No complex math formulas shown to users — only plain English reasoning.

---

## 📥 INPUT DATA REQUIREMENTS

The system requires **6 CSV files**. Keep them minimal and focused.

### 1. **orders.csv** (ESSENTIAL)

**Purpose:** Customer orders waiting to be shipped.

**Required Columns:**

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `order_id` | String | `ORD001` | Unique order reference |
| `customer_id` | String | `CUST_A` | Customer identifier |
| `destination` | String | `DELHI` | Where order must be delivered (city/CMO code) |
| `material_id` | String | `COILS` | Material type (Coils, Plates, Slabs, Bars, etc.) |
| `quantity_tonnes` | Float | `28.5` | Order quantity in metric tonnes |
| `priority` | Integer | `1` | Priority level (1=highest, 5=lowest) |
| `due_date` | ISO DateTime | `2024-01-17T10:00:00Z` | Delivery deadline |

**Optional Columns:**
- `customer_name` (for display only)
- `penalty_rate_per_day` (late delivery charge in ₹)

**What to IGNORE:**
- Width, length, thickness, grade specs
- Defect %, comments, customer contact
- Any other metadata not listed above

**Sample Row:**
```csv
ORD001,CUST_A,DELHI,COILS,28.5,1,2024-01-17T10:00:00Z
ORD002,CUST_B,MUMBAI,PLATES,35.0,2,2024-01-18T10:00:00Z
```

---

### 2. **rakes.csv** (ESSENTIAL)

**Purpose:** Available rakes (train consists) for transport.

**Required Columns:**

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `rake_id` | String | `RAKE_001` | Unique rake identifier |
| `wagon_type` | String | `BOXN` | Type of wagons (BOXN, BOXX, FLAT, etc.) |
| `num_wagons` | Integer | `34` | Number of wagons in this rake |
| `total_capacity_tonnes` | Float | `952.0` | Total rake capacity (num_wagons × per_wagon capacity) |

**Optional Columns:**
- `per_wagon_capacity_tonnes` (calculated from total ÷ num_wagons)
- `available_from_time` (when rake becomes available)
- `current_location` (origin siding)

**Sample Row:**
```csv
RAKE_001,BOXN,34,952.0
RAKE_002,BOXN,34,952.0
RAKE_003,BOXX,40,960.0
```

---

### 3. **stockyards.csv** (ESSENTIAL)

**Purpose:** Warehouse locations and material inventory.

**Required Columns:**

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `stockyard_id` | String | `SY_BOKARO` | Unique stockyard ID |
| `location` | String | `BOKARO` | Location name |
| `material_id` | String | `COILS` | Material type stored here |
| `available_tonnage` | Float | `450.5` | Tonnes in stock |

**Optional Columns:**
- `loading_point_id` (siding number where this is loaded)
- `safety_stock_tonnage` (minimum stock to keep)

**Sample Row:**
```csv
SY_BOKARO,BOKARO,COILS,450.5
SY_BOKARO,BOKARO,PLATES,400.0
SY_BOKARO,BOKARO,SLABS,350.0
```

---

### 4. **product_wagon_matrix.csv** (ESSENTIAL)

**Purpose:** Which materials can go in which wagon types.

**Required Columns:**

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `material_id` | String | `COILS` | Material type |
| `wagon_type` | String | `BOXN` | Compatible wagon type |
| `max_load_per_wagon_tonnes` | Float | `26.0` | Safe loading limit per wagon |
| `allowed` | Boolean | `true` | Is this combination allowed? |

**Sample Row:**
```csv
COILS,BOXN,26.0,true
COILS,BOXX,22.0,true
PLATES,BOXN,25.0,true
PLATES,BOXX,20.0,true
SLABS,BOXN,24.0,true
SLABS,BOXX,19.0,true
```

---

### 5. **loading_points.csv** (REQUIRED)

**Purpose:** Train loading sidings and their constraints.

**Required Columns:**

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `loading_point_id` | String | `LP1` | Siding/platform ID |
| `stockyard_id` | String | `SY_BOKARO` | Which stockyard this serves |
| `max_rakes_per_day` | Integer | `5` | Max rakes that can load per day |
| `loading_rate_tonnes_per_hour` | Float | `120.0` | Loading speed (tonnes/hour) |
| `operating_hours_start` | Integer | `6` | Start time (24-hour format) |
| `operating_hours_end` | Integer | `22` | End time (24-hour format) |

**Optional:**
- `siding_capacity_rakes` (max rakes physically on siding)

**Sample Row:**
```csv
LP1,SY_BOKARO,5,120.0,6,22
```

---

### 6. **routes_costs.csv** (REQUIRED)

**Purpose:** Transport routes with cost and time parameters.

**Required Columns:**

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `origin` | String | `BOKARO` | Origin location code |
| `destination` | String | `DELHI` | Destination location code |
| `mode` | String | `rail` | Transport mode (rail/road) |
| `distance_km` | Float | `1400` | Distance in kilometers |
| `transit_time_hours` | Float | `72` | Estimated transit time |
| `cost_per_tonne` | Float | `280` | Cost per tonne (₹) |

**Optional:**
- `idle_freight_cost_per_hour` (demurrage charge)

**Sample Row:**
```csv
BOKARO,DELHI,rail,1400,72,280
BOKARO,MUMBAI,rail,1200,60,320
BOKARO,BANGALORE,rail,1600,84,350
BOKARO,KOLKATA,rail,400,18,150
```

---

## 📤 OUTPUT DATA

After optimization, the system displays:

### Summary Cards (Top of Dashboard)

1. **Rakes Formed** — Total number of rakes needed
2. **Total Quantity Processed** — Sum of all assigned tonnage (MT)
3. **Average Rake Utilization %** — Average fill rate across all rakes
4. **Total Estimated Cost** — ₹ (transport + loading + demurrage costs)

### Rake-Level Details

For each optimized rake:

```
Rake ID: RAKE_001
Destination: DELHI
Loading Point: LP1
Wagons: 34 (type BOXN)
Quantity: 850 MT
Utilization: 89%
Status: On-time
```

**Clicking a rake opens a drawer showing:**
- Why this rake was chosen (3-4 bullet points)
- Orders assigned to it
- Cost breakdown
- Delivery timeline

### Order-Level Allocation

Table showing each order:

| Order ID | Customer | Material | Qty (MT) | Assigned Rake | Wagon Type | Loading Point | Utilization % | Cost |
|----------|----------|----------|----------|---------------|------------|---------------|---------------|----|
| ORD001 | CUST_A | COILS | 28.5 | RAKE_001 | BOXN | LP1 | 89% | ₹8,000 |
| ORD002 | CUST_B | PLATES | 35.0 | RAKE_001 | BOXN | LP1 | 89% | ₹9,800 |

**Clicking "Best Fit" for an order shows explanation:**

> "ORDER #ORD001 with cargo COILS (28.5t) from CUST_A is allocated to RAKE_001 at LP1, heading to DELHI, because:
> - Destination matches Delhi-bound high-priority orders
> - Material (COILS) is compatible with BOXN wagons
> - Rake utilization reaches 89% (near full)
> - Arrival is 2 days before SLA deadline"

---

## 🔧 OPTIMIZATION LOGIC (SIMPLIFIED)

**What the system does (NOT SHOWN to users):**

1. Sort orders by priority (1=highest)
2. Group orders by destination
3. For each destination, assign orders to available rakes:
   - Check material-wagon compatibility
   - Check quantity fits in rake capacity
   - Stop when rake is ~90% full
4. Calculate costs based on distance, tonnage, and transit time
5. Check if delivery meets SLA deadlines

**Result:** A set of rakes, each with assigned orders, costs, and utilization %

---

## 📋 QUICK CHECKLIST FOR DATA PREP

Before uploading, ensure:

- [ ] **orders.csv** has: order_id, customer_id, destination, material_id, quantity_tonnes, priority, due_date
- [ ] **rakes.csv** has: rake_id, wagon_type, num_wagons, total_capacity_tonnes
- [ ] **stockyards.csv** has: stockyard_id, location, material_id, available_tonnage
- [ ] **product_wagon_matrix.csv** has: material_id, wagon_type, max_load_per_wagon_tonnes, allowed
- [ ] **loading_points.csv** has: loading_point_id, stockyard_id, max_rakes_per_day, loading_rate_tonnes_per_hour, operating_hours_start, operating_hours_end
- [ ] **routes_costs.csv** has: origin, destination, mode, distance_km, transit_time_hours, cost_per_tonne
- [ ] All CSV files have headers in first row
- [ ] No extra columns (they'll be ignored)
- [ ] Dates are in ISO format (YYYY-MM-DDTHH:mm:ssZ)
- [ ] Numbers don't have currency symbols or commas

---

## 🚀 EXAMPLE WORKFLOW

1. **Prepare CSVs** → Fill in your data in the format above
2. **Upload to OptiRake DSS** → Data Input tab
3. **Click "Run Optimization"** → System groups orders into rakes
4. **Review Summary** → See KPIs and AI reasoning steps
5. **Click Rake Cards** → Understand why each rake was chosen
6. **Click Order Rows** → Read natural-language explanations
7. **Approve & Dispatch** → When ready, confirm the plan

---

## 💡 TIPS FOR BEST RESULTS

- **Keep materials generic:** Use "COILS", "PLATES", "SLABS" instead of sub-grades
- **Set realistic priorities:** Mark truly urgent orders as Priority 1
- **Accurate due_dates:** Help the system meet SLAs
- **Route data must exist:** Every order destination must have a route defined
- **Wagon compatibility:** Make sure material+wagon combinations are allowed

---

## ❓ FAQ

**Q: Can I have 100 columns in my orders file?**  
A: Yes, but only the 7 required columns will be used. Ignore the rest.

**Q: What if an order can't fit in any rake?**  
A: It will be flagged as "unassigned" and marked for road transport or next batch.

**Q: Can I change the optimization weights (cost vs. SLA)?**  
A: Not in the UI yet, but the system defaults to 60% cost, 40% SLA compliance.

**Q: How do I upload CSVs?**  
A: Click each file card on the "Data Input" page, or use "Sample Data" to try with example orders.

---

**Version:** 1.0  
**Last Updated:** December 2024  
**For Support:** Contact SAIL logistics team
