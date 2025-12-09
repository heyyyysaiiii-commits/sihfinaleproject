# Real Data Preparation Guide for OptiRake DSS

## 🎯 Overview

You have a compressed SAIL dataset (`compressed_data.csv.gz`) with ~600+ rows of real manufacturing data. This guide helps you:

1. **Extract** the compressed file
2. **Map** SAIL columns to OptiRake format
3. **Generate** the 6 CSV files needed
4. **Upload** and test with OptiRake DSS

---

## 📋 Step 1: Extract the Compressed Data

### On Linux/Mac:
```bash
# Extract the gzip file
gunzip -c compressed_data.csv.gz > sail_data.csv

# View first few rows to understand structure
head -20 sail_data.csv
```

### On Windows (PowerShell):
```powershell
# Extract using 7-Zip or WinRAR
# Or use WSL (Windows Subsystem for Linux)

# If using WSL:
gunzip -c compressed_data.csv.gz > sail_data.csv
head -20 sail_data.csv
```

### Using Online Tool:
- Upload `compressed_data.csv.gz` to https://cloudconvert.com
- Convert to CSV format
- Download extracted CSV

---

## 📊 Step 2: Understand the SAIL Data Structure

Your extracted CSV likely contains columns like:

```
order_id | destination | material | quantity | priority | due_date | ...
```

**Our job:** Extract only the columns OptiRake DSS needs.

---

## 🔧 Step 3: Map SAIL Columns to OptiRake Format

| SAIL Column | OptiRake Column | How to Map | Example |
|-------------|-----------------|-----------|---------|
| `order_id` or `Order` | `order_id` | Use as-is | `ORD001` |
| `customer` or `cust_id` | `customer_id` | Use as-is | `CUST_A` |
| `destination` | `destination` | Extract city code | `DELHI` |
| `grade` or `material_type` | `material_id` | Simplify to bucket | `COILS` |
| `quantity` | `quantity_tonnes` | Use as-is (in tonnes) | `28.5` |
| `priority` | `priority` | Map urgency to 1-5 | `1` (high) |
| `due_date` or `delivery_date` | `due_date` | Convert to ISO format | `2024-01-17T10:00:00Z` |

---

## 🛠️ Step 4: Generate the 6 Required CSV Files

### Method A: Python Script (Recommended)

Create a file `prepare_sail_data.py`:

```python
import pandas as pd
from datetime import datetime

# Load your extracted SAIL data
df = pd.read_csv('sail_data.csv')

print("Columns in SAIL data:")
print(df.columns.tolist())
print(f"\nTotal rows: {len(df)}")
print("\nFirst few rows:")
print(df.head())

# ============================================================
# FILE 1: orders.csv
# ============================================================
orders = df[['order_id', 'customer_id', 'destination', 'material_id', 'quantity_tonnes', 'priority', 'due_date']].copy()

# Clean data
orders['priority'] = orders['priority'].fillna(3).astype(int)
orders['quantity_tonnes'] = orders['quantity_tonnes'].astype(float)

# Ensure due_date is ISO format
orders['due_date'] = pd.to_datetime(orders['due_date']).dt.strftime('%Y-%m-%dT%H:%M:%SZ')

orders.to_csv('orders.csv', index=False)
print("✅ Created orders.csv with", len(orders), "rows")

# ============================================================
# FILE 2: stockyards.csv (Generate from unique materials + locations)
# ============================================================
stockyards = []
materials_list = df['material_id'].unique()

for i, material in enumerate(materials_list):
    stockyard = {
        'stockyard_id': f'SY_BOKARO_{i+1}',
        'location': 'BOKARO',
        'material_id': material,
        'available_tonnage': df[df['material_id'] == material]['quantity_tonnes'].sum() * 1.2,  # 20% buffer
        'loading_point_id': 'LP1'
    }
    stockyards.append(stockyard)

stockyards_df = pd.DataFrame(stockyards)
stockyards_df.to_csv('stockyards.csv', index=False)
print("✅ Created stockyards.csv with", len(stockyards_df), "rows")

# ============================================================
# FILE 3: rakes.csv (Generate standard rake configurations)
# ============================================================
rakes = [
    {'rake_id': 'RAKE_001', 'wagon_type': 'BOXN', 'num_wagons': 34, 'total_capacity_tonnes': 952.0},
    {'rake_id': 'RAKE_002', 'wagon_type': 'BOXN', 'num_wagons': 34, 'total_capacity_tonnes': 952.0},
    {'rake_id': 'RAKE_003', 'wagon_type': 'BOXN', 'num_wagons': 34, 'total_capacity_tonnes': 952.0},
    {'rake_id': 'RAKE_004', 'wagon_type': 'BOXX', 'num_wagons': 40, 'total_capacity_tonnes': 960.0},
    {'rake_id': 'RAKE_005', 'wagon_type': 'BOXX', 'num_wagons': 40, 'total_capacity_tonnes': 960.0},
    {'rake_id': 'RAKE_006', 'wagon_type': 'BOXN', 'num_wagons': 34, 'total_capacity_tonnes': 952.0},
]

rakes_df = pd.DataFrame(rakes)
rakes_df.to_csv('rakes.csv', index=False)
print("✅ Created rakes.csv with", len(rakes_df), "rakes")

# ============================================================
# FILE 4: product_wagon_matrix.csv
# ============================================================
product_wagon = []
wagon_types = ['BOXN', 'BOXX']
materials = df['material_id'].unique()

for material in materials:
    for wagon in wagon_types:
        # Simplify: most materials work with both wagon types
        product_wagon.append({
            'material_id': material,
            'wagon_type': wagon,
            'max_load_per_wagon_tonnes': 26.0 if wagon == 'BOXN' else 22.0,
            'allowed': True
        })

pwm_df = pd.DataFrame(product_wagon)
pwm_df.to_csv('product_wagon_matrix.csv', index=False)
print("✅ Created product_wagon_matrix.csv with", len(pwm_df), "rows")

# ============================================================
# FILE 5: loading_points.csv
# ============================================================
loading_points = [
    {
        'loading_point_id': 'LP1',
        'stockyard_id': 'SY_BOKARO_1',
        'max_rakes_per_day': 5,
        'loading_rate_tonnes_per_hour': 120.0,
        'operating_hours_start': 6,
        'operating_hours_end': 22,
        'siding_capacity_rakes': 5
    }
]

lp_df = pd.DataFrame(loading_points)
lp_df.to_csv('loading_points.csv', index=False)
print("✅ Created loading_points.csv")

# ============================================================
# FILE 6: routes_costs.csv
# ============================================================
destinations = df['destination'].unique()
routes = []

for dest in destinations:
    routes.append({
        'origin': 'BOKARO',
        'destination': dest,
        'mode': 'rail',
        'distance_km': 1400,  # Estimate; adjust based on actual distances
        'transit_time_hours': 72,
        'cost_per_tonne': 280
    })

routes_df = pd.DataFrame(routes)
routes_df.to_csv('routes_costs.csv', index=False)
print("✅ Created routes_costs.csv with", len(routes_df), "routes")

print("\n" + "="*50)
print("SUCCESS! All 6 CSV files generated.")
print("="*50)
print("\nFiles created:")
print("  1. orders.csv")
print("  2. stockyards.csv")
print("  3. rakes.csv")
print("  4. product_wagon_matrix.csv")
print("  5. loading_points.csv")
print("  6. routes_costs.csv")
print("\nNext: Upload these files to OptiRake DSS")
```

### Run the Script:

```bash
python prepare_sail_data.py
```

---

### Method B: Manual Excel/Sheets

If you prefer manual processing:

1. **Open** `sail_data.csv` in Excel/Google Sheets
2. **Create** 6 sheets named: orders, stockyards, rakes, product_wagon_matrix, loading_points, routes_costs
3. **Copy** relevant columns from SAIL data to each sheet
4. **Fill in** missing data (rakes, loading points) with standard values
5. **Export** each sheet as CSV

---

## 📤 Step 5: Upload to OptiRake DSS

1. Go to **Data Input** tab in OptiRake DSS
2. For each file (orders, stockyards, rakes, product_wagon_matrix, loading_points, routes_costs):
   - Click **Upload File** button
   - Select the corresponding CSV
   - System validates the data
3. Once all 6 files are uploaded, click **Run Optimization**

---

## ✅ Checklist Before Uploading

- [ ] Extracted `compressed_data.csv.gz` to `sail_data.csv`
- [ ] Reviewed the columns in your SAIL data
- [ ] Ran the Python script OR manually created 6 CSV files
- [ ] All 6 files have headers in the first row
- [ ] Dates are in ISO format (YYYY-MM-DDTHH:mm:ssZ)
- [ ] Numbers don't have currency symbols or commas
- [ ] All file names match exactly: orders.csv, stockyards.csv, etc.

---

## 🚨 Common Issues & Fixes

### Issue: "Column not found" error
**Cause:** SAIL data column name is different  
**Fix:** Check actual column names in your SAIL CSV and adjust the script

### Issue: "Invalid date format"
**Cause:** Dates not in ISO format  
**Fix:** Use `pd.to_datetime().dt.strftime()` to convert

### Issue: "File upload fails"
**Cause:** Missing required columns  
**Fix:** Check against DATA_SCHEMA.md required columns list

### Issue: "0 orders assigned"
**Cause:** Material types don't match in product_wagon_matrix  
**Fix:** Ensure material names are identical across files

---

## 💡 Tips for Real Data

1. **Check destination names** → Use consistent city/CMO codes (DELHI, MUMBAI, etc.)
2. **Standardize material names** → Group similar materials into buckets (COILS, PLATES, SLABS)
3. **Set realistic priorities** → Only mark truly urgent orders as Priority 1
4. **Verify routes exist** → Every destination in orders.csv must have a route in routes_costs.csv
5. **Generate stockyards from inventory** → Calculate available tonnage based on historical data

---

## 🎯 After Uploading: What to Expect

1. **Optimization takes 2-5 seconds** for 100-500 orders
2. **Results show:**
   - Rakes formed (should be 10-20% fewer than manual planning)
   - Average utilization (target: >80%)
   - Total cost estimate
   - AI reasoning for each rake and order
3. **Review time:** 5-10 minutes to understand all assignments

---

## 📞 Next Steps

Once you have the 6 CSV files:
1. Upload to OptiRake DSS Data Input tab
2. Click "Run Optimization"
3. Review results in Rake Planner and Orders tabs
4. Check DATA_SCHEMA.md for any questions
5. Share feedback with SAIL team

**Ready to test?** Extract your data and run the Python script! 🚀

---

**Version:** 1.0  
**Created:** December 2024  
**For:** SAIL Bokaro Logistics Team
