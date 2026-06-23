# 🎓 School Explorer — Bilingual Web GIS Application

> An interactive Web GIS application that helps families locate, filter, and explore schools across Egyptian governorates and districts.

🔗 **Live Demo:** *[https://hagerhamdy-dev.github.io/school-explorer-webgis/]*
---

## 📌 Overview

School Explorer transforms a static dataset of school locations into an interactive mapping experience. Users can filter schools by governorate and district, instantly see how many schools match their filter, and view details for each school through map popups — all running entirely client-side, with no backend required.

The interface is fully bilingual (Arabic RTL / English LTR), reflecting the real language needs of its target audience.

> **Data note:** This demo uses a sample dataset of schools across Greater Cairo for demonstration purposes.

## ✨ Key Features

- **Interactive mapping** — built with Leaflet.js, including custom markers, detail popups, and automatic fit-to-bounds on filter changes
- **Cascading spatial filters** — Governorate → District dropdowns update dynamically based on the selected governorate
- **Live statistics** — a real-time counter reflects how many schools match the current filter
- **Client-side spatial processing** — GeoJSON filtering and rendering handled entirely in the browser with vanilla JavaScript (ES6+), no server round-trips
- **Bilingual interface** — full Arabic (RTL) and English (LTR) layout support, including UI mirroring
- **Responsive design** — CSS3 Flexbox/Grid layout that adapts across screen sizes

## 🚧 In Progress

- **Document submission form** — each school popup will include an "Apply" button opening a form to collect and email required documents directly to the school. *(Currently in development — not yet live in this demo.)*

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mapping | Leaflet.js |
| Data format | GeoJSON |
| Logic | JavaScript (ES6+) |
| Styling | CSS3 (Flexbox, Grid) |
| Localization | Custom RTL/LTR layout switching |

## 🚀 Running Locally

This is a static front-end application — no build step required.


## 📂 Project Structure

```
├── index.html          # Main application entry point
├── css/
│   └── style.css       # Responsive, bilingual (RTL/LTR) styling
├── js/
│   └── app.js           # Filtering logic, map rendering, state handling
└── data/
    └── schools.geojson  # Sample school location dataset
```

## 🗺️ Roadmap
- [ ] Complete the school application/document submission form
- [ ] Add marker clustering for dense areas
- [ ] Add a loading indicator while data loads

## 👤 Author
**Hager Hamdy** — Web GIS Developer
[LinkedIn](www.linkedin.com/in/hager-hamdy-dev) · [GitHub](https://github.com/hagerhamdy-dev)


**Hager Hamdy** — Web GIS Developer
[LinkedIn](#) · [GitHub](#)
