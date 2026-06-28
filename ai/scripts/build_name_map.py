import csv
import json
import re
import time
from pathlib import Path

import requests

_AI_ROOT = Path(__file__).resolve().parent.parent

PUBCHEM = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"
MAX_RETRIES = 3
BATCH_LOOKUP = 300
USER_AGENT = "AXON-DDI/1.0"


def _fetch(url, retries=MAX_RETRIES):
    for attempt in range(retries):
        try:
            resp = requests.get(
                url, headers={"User-Agent": USER_AGENT}, timeout=30
            )
            if resp.status_code in (200, 404):
                return resp
            if resp.status_code == 503:
                time.sleep(5 * (attempt + 1))
                continue
            if attempt < retries - 1:
                time.sleep(2)
        except requests.RequestException:
            if attempt < retries - 1:
                time.sleep(3)
    return None


def batch_lookup_cids(source_ids, source="DrugBank"):
    """Batch-look up DrugBank IDs → CIDs via PubChem substance sourceid."""
    cid_map = {}
    for start in range(0, len(source_ids), BATCH_LOOKUP):
        batch = source_ids[start:start + BATCH_LOOKUP]
        ids = ",".join(batch)
        url = f"{PUBCHEM}/substance/sourceid/{source}/{ids}/cids/JSON"
        print(f"  Looking up {source} IDs {start}-{start + len(batch)}...")
        resp = _fetch(url)
        if resp and resp.status_code == 200:
            for item in resp.json().get("InformationList", {}).get("Information", []):
                # PubChem returns SID for each source ID; we need to link back
                # The response order matches the request order
                cids = item.get("CID", [])
                if cids:
                    cid_map[cids[0]] = None  # placeholder, we fill ID later
        time.sleep(0.3)
    return cid_map


def batch_fetch_names(cid_numbers):
    """Batch-fetch preferred names for list of CID integers."""
    name_map = {}
    for start in range(0, len(cid_numbers), BATCH_LOOKUP):
        batch = cid_numbers[start:start + BATCH_LOOKUP]
        cid_str = ",".join(str(c) for c in batch)
        url = f"{PUBCHEM}/compound/cid/{cid_str}/property/Title/JSON"
        print(f"  Fetching names for CID batch {start}-{start + len(batch)}...")
        resp = _fetch(url)
        if resp and resp.status_code == 200:
            for item in resp.json().get("PropertyTable", {}).get("Properties", []):
                name = item.get("Title", "").strip().lower()
                cid = item.get("CID")
                if name and cid:
                    name_map[cid] = name
        time.sleep(0.3)
    return name_map


def build_twosides_map():
    print("\n=== Twosides (CID → name) ===")
    csv_path = _AI_ROOT / "data" / "Twosides" / "drug_smiles.csv"
    if not csv_path.exists():
        print("  File not found, skipping")
        return {}, 0

    cid_numbers = []
    id_map = {}
    with open(csv_path) as f:
        for row in csv.DictReader(f):
            cid_str = row["drug_id"].strip()
            if cid_str.startswith("CID"):
                cid_num = int(cid_str[3:])
                cid_numbers.append(cid_num)
                id_map[cid_num] = cid_str

    names = batch_fetch_names(cid_numbers)

    name_map = {}
    for cid_num, cid_full in id_map.items():
        name = names.get(cid_num)
        if name:
            name_map[name] = {"id": cid_full, "dataset": "twosides"}

    print(f"  Mapped {len(name_map)} / {len(id_map)} Twosides drugs")
    return name_map, len(id_map)


def build_drugbank_map():
    print("\n=== DrugBank (DB ID → PubChem CID → name) ===")
    csv_path = _AI_ROOT / "data" / "DrugBank" / "drug_smiles.csv"
    if not csv_path.exists():
        print("  File not found, skipping")
        return {}, 0

    db_ids = []
    with open(csv_path) as f:
        for row in csv.DictReader(f):
            db_id = row["drug_id"].strip()
            if db_id:
                db_ids.append(db_id)

    # Step 1: Batch-look up DB IDs → CIDs via PubChem substance sourceid
    print("  Step 1: Converting DrugBank IDs to PubChem CIDs...")
    cid_map = {}  # CID (int) → DB ID (str)
    for start in range(0, len(db_ids), BATCH_LOOKUP):
        batch = db_ids[start:start + BATCH_LOOKUP]
        ids = ",".join(batch)
        url = f"{PUBCHEM}/substance/sourceid/DrugBank/{ids}/cids/JSON"
        print(f"    Batch {start}-{start + len(batch)}...")
        resp = _fetch(url)
        if resp and resp.status_code == 200:
            for i, item in enumerate(
                resp.json().get("InformationList", {}).get("Information", [])
            ):
                cids = item.get("CID", [])
                if cids:
                    cid_map[cids[0]] = batch[i] if i < len(batch) else None
        time.sleep(0.3)

    if not cid_map:
        print("  No CIDs resolved from DrugBank IDs")
        return {}, len(db_ids)

    # Step 2: Batch-fetch names for all resolved CIDs
    print(f"  Step 2: Fetching names for {len(cid_map)} CIDs...")
    names = batch_fetch_names(list(cid_map.keys()))

    name_map = {}
    for cid_num, db_id in cid_map.items():
        name = names.get(cid_num)
        if name and db_id:
            name_map[name] = {"id": db_id, "dataset": "drugbank"}

    print(f"  Mapped {len(name_map)} / {len(db_ids)} DrugBank drugs")
    return name_map, len(db_ids)


# ─── Aliases for common name variants ───
# Format: {"alias": {"id": "...", "dataset": "..."}}
# These override or supplement the PubChem titles
MANUAL_ALIASES = {
    "ibuprofen": {"id": "DB01050", "dataset": "drugbank"},
    "acetaminophen": {"id": "DB00316", "dataset": "drugbank"},
    "paracetamol": {"id": "DB00316", "dataset": "drugbank"},
    "vitamin c": {"id": "DB00126", "dataset": "drugbank"},
    "ascorbic acid": {"id": "DB00126", "dataset": "drugbank"},
    "vitamin d": {"id": "DB00169", "dataset": "drugbank"},
    "vitamin d3": {"id": "DB00169", "dataset": "drugbank"},
    "cholecalciferol": {"id": "DB00169", "dataset": "drugbank"},
    "vitamin e": {"id": "DB00163", "dataset": "drugbank"},
    "tocopherol": {"id": "DB00163", "dataset": "drugbank"},
    "vitamin a": {"id": "DB00162", "dataset": "drugbank"},
    "retinol": {"id": "DB00162", "dataset": "drugbank"},
    "vitamin k": {"id": "DB01022", "dataset": "drugbank"},
    "phylloquinone": {"id": "DB01022", "dataset": "drugbank"},
    "vitamin b1": {"id": "DB00152", "dataset": "drugbank"},
    "thiamine": {"id": "DB00152", "dataset": "drugbank"},
    "vitamin b2": {"id": "DB00140", "dataset": "drugbank"},
    "riboflavin": {"id": "DB00140", "dataset": "drugbank"},
    "vitamin b3": {"id": "DB00627", "dataset": "drugbank"},
    "niacin": {"id": "DB00627", "dataset": "drugbank"},
    "vitamin b6": {"id": "DB00165", "dataset": "drugbank"},
    "pyridoxine": {"id": "DB00165", "dataset": "drugbank"},
    "vitamin b12": {"id": "DB00115", "dataset": "drugbank"},
    "cyanocobalamin": {"id": "DB00115", "dataset": "drugbank"},
    "folic acid": {"id": "DB00158", "dataset": "drugbank"},
    "calcium": {"id": "DB01373", "dataset": "drugbank"},
    "iron": {"id": "DB14736", "dataset": "drugbank"},
    "magnesium": {"id": "DB01378", "dataset": "drugbank"},
    "zinc": {"id": "DB01593", "dataset": "drugbank"},
    "potassium": {"id": "DB01345", "dataset": "drugbank"},
    "omega-3": {"id": "DB11138", "dataset": "drugbank"},
    "fish oil": {"id": "DB11138", "dataset": "drugbank"},
    "sodium": {"id": "DB01373", "dataset": "drugbank"},
    "biotin": {"id": "DB00121", "dataset": "drugbank"},
    "aspirin": {"id": "DB00945", "dataset": "drugbank"},
    "insulin": {"id": "DB00030", "dataset": "drugbank"},
    "morphine": {"id": "DB00295", "dataset": "drugbank"},
    "codeine": {"id": "DB00318", "dataset": "drugbank"},
    "amoxicillin": {"id": "DB01060", "dataset": "drugbank"},
    "penicillin": {"id": "DB00431", "dataset": "drugbank"},
    "atorvastatin": {"id": "DB01076", "dataset": "drugbank"},
    "simvastatin": {"id": "DB00641", "dataset": "drugbank"},
    "lisinopril": {"id": "DB00722", "dataset": "drugbank"},
    "omeprazole": {"id": "DB00338", "dataset": "drugbank"},
    "metformin": {"id": "DB00331", "dataset": "drugbank"},
    "amlodipine": {"id": "DB00381", "dataset": "drugbank"},
    "diazepam": {"id": "DB00829", "dataset": "drugbank"},
    "lorazepam": {"id": "DB00186", "dataset": "drugbank"},
    "prednisone": {"id": "DB00635", "dataset": "drugbank"},
    "levothyroxine": {"id": "DB00451", "dataset": "drugbank"},
    "hydrochlorothiazide": {"id": "DB00999", "dataset": "drugbank"},
    "metoprolol": {"id": "DB00264", "dataset": "drugbank"},
    "albuterol": {"id": "DB01007", "dataset": "drugbank"},
    "losartan": {"id": "DB00678", "dataset": "drugbank"},
    "clopidogrel": {"id": "DB00758", "dataset": "drugbank"},
    "fluoxetine": {"id": "DB00472", "dataset": "drugbank"},
    "omeprazole": {"id": "DB00338", "dataset": "drugbank"},
    "pantoprazole": {"id": "DB00213", "dataset": "drugbank"},
    "cetirizine": {"id": "DB00341", "dataset": "drugbank"},
    "loratadine": {"id": "DB00455", "dataset": "drugbank"},
    "diphenhydramine": {"id": "DB01075", "dataset": "drugbank"},
    "ranitidine": {"id": "DB00863", "dataset": "drugbank"},
    "famotidine": {"id": "DB00927", "dataset": "drugbank"},
    "ondansetron": {"id": "DB00904", "dataset": "drugbank"},
    "prednisolone": {"id": "DB00860", "dataset": "drugbank"},
    "dexamethasone": {"id": "DB01234", "dataset": "drugbank"},
    "digoxin": {"id": "DB00390", "dataset": "drugbank"},
    "furosemide": {"id": "DB00695", "dataset": "drugbank"},
    "spironolactone": {"id": "DB00421", "dataset": "drugbank"},
    "nitroglycerin": {"id": "DB00727", "dataset": "drugbank"},
    "heparin": {"id": "DB00509", "dataset": "drugbank"},
    "enoxaparin": {"id": "DB01225", "dataset": "drugbank"},
    "rivaroxaban": {"id": "DB06228", "dataset": "drugbank"},
    "apixaban": {"id": "DB07805", "dataset": "drugbank"},
    "dabigatran": {"id": "DB06695", "dataset": "drugbank"},
}


def _strip_qualifiers(name):
    """Remove PubChem stereochemistry qualifiers for cleaner matching."""
    import re
    name = re.sub(r",\s*\([+-]+/[-]+\)", "", name)
    name = re.sub(r",\s*\([+-]+\)", "", name)
    name = re.sub(r",\s*\([SR]\)", "", name)
    name = re.sub(r",\s*\([SR],[SR]\)", "", name)
    name = re.sub(r",\s*\(\+-\)\)", "", name)
    name = re.sub(r",\s*\(\+-/-\+\)", "", name)
    name = re.sub(r",\s*dl-", " ", name)
    name = name.strip()
    return name


def _generate_aliases(name_map):
    """Add alias entries by stripping qualifiers and adding manual aliases."""
    additions = {}

    for name, info in list(name_map.items()):
        stripped = _strip_qualifiers(name)
        if stripped != name and stripped not in name_map:
            additions[stripped] = info

    for alias, info in MANUAL_ALIASES.items():
        if alias not in name_map:
            additions[alias] = info

    name_map.update(additions)
    return name_map


def build_name_map():
    name_map = {}
    total = 0

    ts_map, ts_total = build_twosides_map()
    name_map.update(ts_map)
    total += ts_total

    db_map, db_total = build_drugbank_map()
    name_map.update(db_map)
    total += db_total

    print(f"\nAdding aliases...")
    name_map = _generate_aliases(name_map)

    out_path = _AI_ROOT / "data" / "drug_name_map.json"
    with open(out_path, "w") as f:
        json.dump(name_map, f, indent=2)
    print(f"\n=== Done: {len(name_map)} names mapped out of {total} total drugs ===")
    print(f"  Output: {out_path}")


if __name__ == "__main__":
    build_name_map()
