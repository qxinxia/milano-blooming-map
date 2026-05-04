"""
Merge all raw sources, enrich with bloom calendar, deduplicate, and export.

Input:
  data/raw/osm_trees.geojson
  data/raw/milano_trees.geojson
  data/raw/inaturalist_observations.geojson
  data/raw/gbif_observations.geojson
  data/raw/plantnet_observations.geojson
  data/bloom_calendar.json

Output:
  data/processed/milan_blooming.geojson
  frontend/src/data/milan_blooming.geojson   (copy for the React app)

Run: python3 scripts/04_process_and_merge.py
"""

import json
import math
import uuid
from pathlib import Path

ROOT = Path(__file__).parent.parent
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"
CALENDAR_PATH = ROOT / "data" / "bloom_calendar.json"
FRONTEND_DATA = ROOT / "frontend" / "src" / "data"


def load_geojson(path):
    if not path.exists():
        print(f"  [skip] {path.name} not found")
        return []
    with open(path) as f:
        return json.load(f)["features"]


def load_calendar():
    with open(CALENDAR_PATH) as f:
        cal = json.load(f)
    return cal["genera"]


def enrich(features, calendar):
    """Add bloom_months, color, type from calendar keyed by genus."""
    enriched = []
    no_match = 0
    for feat in features:
        genus = (feat["properties"].get("genus") or "").strip()
        cal_entry = calendar.get(genus)
        if not cal_entry:
            no_match += 1
            continue  # skip trees/plants with no bloom data

        props = feat["properties"]
        enriched.append({
            "type": "Feature",
            "geometry": feat["geometry"],
            "properties": {
                "id": str(uuid.uuid4()),
                "genus": genus,
                "species": props.get("species", genus),
                "species_common": props.get("species_common") or cal_entry["common"],
                "common_name": cal_entry["common"],
                "bloom_months": cal_entry["bloom_months"],
                "color": cal_entry["color"],
                "plant_type": cal_entry["type"],
                "source": props.get("source", "unknown"),
                "image_url": props.get("image_url", ""),
                "notes": cal_entry.get("notes", ""),
            }
        })
    if no_match:
        print(f"    {no_match} features had no bloom calendar entry (skipped)")
    return enriched


def spatial_deduplicate(features, threshold_m=10):
    """Remove near-duplicate points within threshold_m metres using a spatial grid."""
    # Grid cell size slightly larger than threshold so we only check 9 neighboring cells
    cell_deg = threshold_m / 111320 * 1.5
    grid = {}  # (cell_x, cell_y) -> list of (lng, lat)
    kept = []

    def cell(lng, lat):
        return (int(lng / cell_deg), int(lat / cell_deg))

    def neighbors(cx, cy):
        return [(cx + dx, cy + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)]

    def near(lng, lat):
        for ncell in neighbors(*cell(lng, lat)):
            for slng, slat in grid.get(ncell, []):
                dlat = (lat - slat) * 111320
                dlng = (lng - slng) * 111320 * math.cos(math.radians((lat + slat) / 2))
                if math.sqrt(dlat**2 + dlng**2) < threshold_m:
                    return True
        return False

    for feat in features:
        lng, lat = feat["geometry"]["coordinates"]
        if not near(lng, lat):
            kept.append(feat)
            c = cell(lng, lat)
            grid.setdefault(c, []).append((lng, lat))

    return kept


def main():
    print("=== Milan Blooming Map — Data Processing ===\n")
    calendar = load_calendar()
    print(f"Bloom calendar loaded: {len(calendar)} genera\n")

    # Load raw sources
    print("Loading raw sources...")
    osm = load_geojson(RAW / "osm_trees.geojson")
    milano = load_geojson(RAW / "milano_trees.geojson")
    inat = load_geojson(RAW / "inaturalist_observations.geojson")
    gbif = load_geojson(RAW / "gbif_observations.geojson")
    plantnet = load_geojson(RAW / "plantnet_observations.geojson")
    print(f"  OSM: {len(osm)} | Milano OD: {len(milano)} | iNaturalist: {len(inat)} | GBIF: {len(gbif)} | Pl@ntNet: {len(plantnet)}")

    all_raw = osm + milano + inat + gbif + plantnet
    print(f"  Total raw: {len(all_raw)}\n")

    # Enrich with bloom data
    print("Enriching with bloom calendar...")
    enriched = enrich(all_raw, calendar)
    print(f"  After enrichment: {len(enriched)} features\n")

    # Spatial deduplication (10m threshold)
    print("Deduplicating (10m threshold)...")
    deduped = spatial_deduplicate(enriched, threshold_m=10)
    print(f"  After dedup: {len(deduped)} features\n")

    # Slim features: drop redundant fields, truncate coordinates to 5dp (~1m precision)
    KEEP_PROPS = {'species', 'common_name', 'bloom_months', 'color', 'plant_type', 'source', 'image_url'}
    slim = []
    for feat in deduped:
        lng, lat = feat["geometry"]["coordinates"]
        p = feat["properties"]
        slim.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [round(lng, 5), round(lat, 5)]},
            "properties": {k: v for k, v in p.items() if k in KEEP_PROPS and v != ""},
        })

    geojson_out = {"type": "FeatureCollection", "features": slim}
    PROCESSED.mkdir(parents=True, exist_ok=True)
    with open(PROCESSED / "milan_blooming.geojson", "w") as f:
        json.dump(geojson_out, f, separators=(',', ':'))
    print(f"Saved → {PROCESSED / 'milan_blooming.geojson'}")

    # Also copy to frontend data folder
    FRONTEND_DATA.mkdir(parents=True, exist_ok=True)
    with open(FRONTEND_DATA / "milan_blooming.geojson", "w") as f:
        json.dump(geojson_out, f, separators=(',', ':'))
    print(f"Copied → {FRONTEND_DATA / 'milan_blooming.geojson'}")
    print(f"\nDone. {len(deduped)} blooming features ready.")


if __name__ == "__main__":
    main()
