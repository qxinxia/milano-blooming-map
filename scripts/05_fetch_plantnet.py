"""
Fetch plant observations from Pl@ntNet via GBIF.
Pl@ntNet publishes validated observations to GBIF with high confidence.
Saves to data/raw/plantnet_observations.geojson

Note: We fetch via GBIF's API, which has the Pl@ntNet dataset integrated.
"""

import json
import time
import requests
from pathlib import Path

API_BASE = "https://api.gbif.org/v1/occurrence/search"

# Pl@ntNet observations dataset in GBIF (7a3679ef-5582-4aaa-81f0-8c2545cafc81)
# Milan area bounds (using GBIF's decimal bounds format: min,max)
PARAMS = {
    "datasetKey": "7a3679ef-5582-4aaa-81f0-8c2545cafc81",  # Pl@ntNet observations
    "decimalLatitude": "45.38,45.54",
    "decimalLongitude": "9.04,9.28",
    "hasCoordinate": "true",
    "limit": 300,
}

MAX_PAGES = 15  # ~4500 observations


def fetch():
    print("Fetching Pl@ntNet observations from GBIF for Milan area...")
    print("(Using Pl@ntNet observations dataset published to GBIF)\n")
    all_features = []
    page = 0

    while page < MAX_PAGES:
        params = {**PARAMS, "offset": page * PARAMS["limit"]}
        print(f"  Fetching page {page + 1}...", end="", flush=True)

        try:
            resp = requests.get(API_BASE, params=params, timeout=45)
            resp.raise_for_status()
            data = resp.json()
        except requests.exceptions.Timeout:
            print(" [timeout, stopping]")
            break
        except requests.exceptions.RequestException as e:
            print(f" [error: {e}]")
            break

        results = data.get("results", [])
        print(f" got {len(results)}")

        if not results:
            break

        for obs in results:
            if not obs.get("decimalLatitude") or not obs.get("decimalLongitude"):
                continue

            genus = _extract_genus(obs)
            observed_month = _extract_month(obs.get("eventDate", ""))

            all_features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [obs["decimalLongitude"], obs["decimalLatitude"]]
                },
                "properties": {
                    "source": "plantnet",
                    "gbif_id": obs.get("key"),
                    "genus": genus,
                    "species": _get_species(obs),
                    "species_common": _get_common_name(obs),
                    "observed_month": observed_month,
                    "event_date": obs.get("eventDate", ""),
                    "dataset_name": obs.get("datasetName", ""),
                    "gbif_url": f"https://www.gbif.org/occurrence/{obs.get('key')}",
                }
            })

        print(f"    → {len(results)} observations (total: {len(all_features)})")

        if len(results) < PARAMS["limit"]:
            break

        page += 1
        time.sleep(0.3)

    out_path = Path(__file__).parent.parent / "data" / "raw" / "plantnet_observations.geojson"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump({"type": "FeatureCollection", "features": all_features}, f)
    print(f"\n✓ Saved {len(all_features)} observations → {out_path}")


def _extract_genus(obs):
    taxon = obs.get("taxon") or {}
    if taxon.get("genus"):
        return taxon["genus"]
    name = obs.get("scientificName", "")
    parts = name.strip().split()
    return parts[0] if parts else ""


def _get_species(obs):
    taxon = obs.get("taxon") or {}
    if taxon.get("species"):
        return taxon["species"]
    return obs.get("scientificName", "")


def _get_common_name(obs):
    if obs.get("vernacularName"):
        return obs["vernacularName"]
    taxon = obs.get("taxon") or {}
    return taxon.get("commonName", "")


def _extract_month(event_date):
    """Extract month from ISO date string (YYYY-MM-DD or YYYY-MM)"""
    if not event_date or "-" not in event_date:
        return None
    try:
        parts = event_date.split("-")
        if len(parts) >= 2:
            month = int(parts[1])
            return month if 1 <= month <= 12 else None
    except (ValueError, IndexError):
        return None
    return None


if __name__ == "__main__":
    fetch()
