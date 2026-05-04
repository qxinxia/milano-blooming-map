"""
Fetch plant observations from iNaturalist around Milan.
Focuses on flowering plants (Plantae kingdom) with research-grade observations.
Saves to data/raw/inaturalist_observations.geojson
"""

import json
import time
import requests
from pathlib import Path

# Milan approx center and radius
MILAN_LAT = 45.464
MILAN_LNG = 9.190
RADIUS_KM = 15

API_BASE = "https://api.inaturalist.org/v1/observations"

PARAMS = {
    "lat": MILAN_LAT,
    "lng": MILAN_LNG,
    "radius": RADIUS_KM,
    "taxon_name": "Plantae",        # Kingdom Plantae only
    "quality_grade": "research",    # verified observations only
    "has[]": "geo",
    "per_page": 200,
    "order": "desc",
    "order_by": "observed_on",
}

MAX_PAGES = 10  # 2000 observations max; increase for more coverage


def fetch():
    print("Fetching iNaturalist plant observations for Milan area...")
    all_features = []

    for page in range(1, MAX_PAGES + 1):
        params = {**PARAMS, "page": page}
        resp = requests.get(API_BASE, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        results = data.get("results", [])
        if not results:
            break

        for obs in results:
            if not obs.get("location"):
                continue
            lat_str, lng_str = obs["location"].split(",")
            taxon = obs.get("taxon") or {}
            genus = _extract_genus(taxon)
            observed_on = obs.get("observed_on", "")
            month = int(observed_on.split("-")[1]) if observed_on and "-" in observed_on else None

            all_features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(lng_str), float(lat_str)]
                },
                "properties": {
                    "source": "inaturalist",
                    "inat_id": obs.get("id"),
                    "genus": genus,
                    "species": taxon.get("name", ""),
                    "species_common": taxon.get("preferred_common_name", ""),
                    "observed_month": month,
                    "image_url": _thumb(obs),
                    "inat_url": f"https://www.inaturalist.org/observations/{obs.get('id')}",
                }
            })

        print(f"  Page {page}: {len(results)} observations (total so far: {len(all_features)})")
        if len(results) < PARAMS["per_page"]:
            break
        time.sleep(1)  # be polite to the API

    out_path = Path(__file__).parent.parent / "data" / "raw" / "inaturalist_observations.geojson"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump({"type": "FeatureCollection", "features": all_features}, f)
    print(f"  Saved {len(all_features)} observations → {out_path}")


def _extract_genus(taxon):
    name = taxon.get("name", "")
    parts = name.strip().split()
    return parts[0] if parts else ""


def _thumb(obs):
    photos = obs.get("photos") or []
    if photos:
        return photos[0].get("url", "").replace("square", "medium")
    return ""


if __name__ == "__main__":
    fetch()
