# 🧊 GLB Viewer (Three.js)

This project is a simple web-based **3D GLB model viewer** built with **Three.js**.  
It loads and displays `.glb` (GLTF Binary) models directly in the browser with interactive controls.

The viewer supports **Draco-compressed GLB files**, camera orbit controls, responsive resizing, and basic lighting.

---

## ✨ Features

- Load and display `.glb` / `.gltf` 3D models
- Supports **Draco compression**
- Interactive camera (rotate, zoom, pan)
- Responsive fullscreen canvas
- No build tools or bundlers required
- Works on **GitHub Pages**

---

## 🛠 Technologies Used

- HTML5
- JavaScript (ES Modules)
- Three.js
- GLTFLoader
- DRACOLoader
- OrbitControls

---

## 📁 Project Structure

```
/
├── index.html
├── ahil.glb
└── README.md
```

> ⚠️ The `.glb` file **must be in the same folder** as `index.html`  
> File names are **case-sensitive** on GitHub Pages.

---

## ▶️ How to Run the Project Locally

> ❗ The project **will NOT work** if you open `index.html` with double click (`file://`)

### Option 1: Using Python
```bash
python -m http.server
```

Then open:
```
http://localhost:8000
```

### Option 2: Using Node.js
```bash
npx serve
```

---

## 🌐 Running on GitHub Pages

1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Select:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Open the generated URL:
```
https://<username>.github.io/<repository-name>/
```

---

## 🧩 Draco Compression

This project supports **Draco-compressed GLB models**.

If your model is compressed, `DRACOLoader` is required (already included in the code).

If you want to export a GLB **without Draco** (optional):
- Blender → Export → glTF (.glb)
- Disable **Draco Compression**

---

## 🎮 Controls

- **Left Mouse** – Rotate model
- **Scroll Wheel** – Zoom
- **Right Mouse** – Pan

---

## 📌 Notes

- Uses CDN imports (no npm needed)
- Modern browsers required (Chrome, Edge, Firefox)
- Internet connection required for Three.js CDN

---

## 📄 License

This project is open-source and free to use for educational and personal purposes.

