# Blooming Milano

An interactive map visualizing flowering trees and gardens across Milan, month by month.

![Blooming Milano](https://github.com/qxinxia/milano-blooming-map/raw/main/design-preview.html)

## What it does

- Browse **~100,000 trees** across Milan, binned into H3 hexagonal cells
- Scroll through **12 months** to watch bloom patterns shift with the seasons
- **16 species** tracked individually — cherry blossom, magnolia, wisteria, maple, and more
- Maples appear only in **autumn (Sep–Nov)** with red foliage; hidden all other months
- Click any hotspot or hex cell to open a species **InfoBox** with image, bloom calendar, and seasonal status
- **Species Guide** in the legend lets you search and filter by plant or season

## Tech stack

| Layer | Tools |
|---|---|
| Map | [MapLibre GL JS](https://maplibre.org/) + CartoDB basemap |
| Hex binning | [H3](https://h3geo.org/) at resolution 10 (~65 m cells) |
| Frontend | React 18 + Vite |
| Data | OpenStreetMap, GBIF, iNaturalist, PlantNet, Milano Open Data |

## Running locally

```bash
cd frontend
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

The processed GeoJSON (`frontend/public/milan_blooming.geojson`) is included in the repo — no extra data download needed.

## Data pipeline

Scripts in `scripts/` fetch and merge tree data from multiple sources:

```
01_fetch_osm.py          # OpenStreetMap trees
02_parse_milano_opendata.py  # Milano city open data
02_fetch_gbif.py         # GBIF species observations
03_fetch_inaturalist.py  # iNaturalist observations
04_process_and_merge.py  # Merge, deduplicate, assign bloom months
05_fetch_plantnet.py     # PlantNet species enrichment
```

Install Python dependencies: `pip install -r scripts/requirements.txt`

Raw source files (`data/raw/`) are excluded from the repo due to size.

## Species covered

Spring · Cherry Blossom · Magnolia · Judas Tree · Crabapple · Wisteria · Lilac · Forsythia · Hawthorn  
Summer · Rose · Linden Tree · Jacaranda · Black Locust · Crape Myrtle · Catalpa  
Autumn · Maple (foliage only)  
Year-round · Horse Chestnut

## License

Data © OpenStreetMap contributors, GBIF, iNaturalist, Comune di Milano.  
Code MIT.
