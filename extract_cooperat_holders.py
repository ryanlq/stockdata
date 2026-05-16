import json

with open("temp.json", "r", encoding="utf-8") as f:
    data = json.load(f)

seen = set()
results = []

for item in data:
    key = item.get("COOPERAT_HOLDER_NEW", "")
    if key and key not in seen:
        seen.add(key)
        results.append({
            "COOPERAT_HOLDER": item["COOPERAT_HOLDER"],
            "COOPERAT_HOLDER_TYPE": item["COOPERAT_HOLDER_TYPE"],
            "COOPERAT_HOLDER_NEW": item["COOPERAT_HOLDER_NEW"],
        })

print(f"去重后共 {len(results)} 条")

with open("cooperat_holders.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("已保存到 cooperat_holders.json")
