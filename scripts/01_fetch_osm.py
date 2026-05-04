"""
Fetch trees tagged with natural=tree from OpenStreetMap via Overpass API.
Saves output to data/raw/osm_trees.geojson
"""

import json
import requests
import time
from pathlib import Path

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Milan bounding box: south, west, north, east
MILAN_BBOX = "45.38,9.04,45.54,9.28"

QUERY = f"""
[out:json][timeout:120];
(
  node["natural"="tree"]({MILAN_BBOX});
  node["natural"="tree"]["genus"]({MILAN_BBOX});
);
out body;
"""


def fetch_osm_trees():
    print("Fetching trees from OpenStreetMap Overpass API...")
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "MilanBloomingMap/1.0 (educational project)",
    }
    response = requests.post(OVERPASS_URL, data={"data": QUERY}, headers=headers, timeout=150)
    response.raise_for_status()
    data = response.json()
    elements = data.get("elements", [])
    print(f"  Found {len(elements)} OSM tree nodes")

    features = []
    for el in elements:
        if el.get("type") != "node":
            continue
        tags = el.get("tags", {})
        genus = tags.get("genus") or tags.get("species:genus") or _extract_genus(tags.get("species", ""))
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [el["lon"], el["lat"]]},
            "properties": {
                "source": "osm",
                "osm_id": el["id"],
                "genus": genus,
                "species": tags.get("species", ""),
                "species_common": tags.get("species:en") or tags.get("name", ""),
                "height": tags.get("height", ""),
                "circumference": tags.get("circumference", ""),
            }
        })

    geojson = {"type": "FeatureCollection", "features": features}
    out_path = Path(__file__).parent.parent / "data" / "raw" / "osm_trees.geojson"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(geojson, f)
    print(f"  Saved {len(features)} features → {out_path}")


def _extract_genus(species_str):
    if not species_str:
        return ""
    parts = species_str.strip().split()
    return parts[0] if parts else ""


if __name__ == "__main__":
    fetch_osm_trees()
