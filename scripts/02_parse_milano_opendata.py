"""
Parse the Milano Open Data tree inventory GeoJSON.
Input:  ds2484_alberi_20240331.geojson  (already in project root)
Output: data/raw/milano_trees.geojson   (normalized subset)

The source has 247k trees with 'genere' (genus) and 'specie' fields.
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
SOURCE = ROOT / "ds2484_alberi_20240331.geojson"
OUT = ROOT / "data" / "raw" / "milano_trees.geojson"


def parse():
    print("Parsing Milano Open Data tree inventory...")
    with open(SOURCE) as f:
        raw = json.load(f)

    features = []
    skipped = 0
    for feat in raw["features"]:
        props = feat["properties"]
        coords = feat["geometry"]["coordinates"]

        # Skip entries without valid coordinates or genus
        if not coords or not coords[0] or not coords[1]:
            skipped += 1
            continue
        genus = (props.get("genere") or "").strip()
        if not genus:
            skipped += 1
            continue

        species_epithet = (props.get("specie") or "").strip()
        features.append({
            "type": "Feature",
            "geometry": feat["geometry"],
            "properties": {
                "source": "milano_opendata",
                "milano_id": props.get("obj_id") or props.get("codice"),
                "genus": genus,
                "species": f"{genus} {species_epithet}".strip() if species_epithet else genus,
                "species_common": "",
                "municipio": props.get("municipio", ""),
                "area": props.get("area", ""),
                "diam_chiom": props.get("diam_chiom", ""),
                "h_m": props.get("h_m", ""),
            }
        })

    print(f"  Parsed {len(features)} features (skipped {skipped})")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w") as f:
        json.dump({"type": "FeatureCollection", "features": features}, f)
    print(f"  Saved → {OUT}")


if __name__ == "__main__":
    parse()
