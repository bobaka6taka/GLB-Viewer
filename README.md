# GLB/GLTF 3D Web Viewer

A minimalist, fast, and modern web-based viewer for 3D models in `.glb` and `.gltf` formats. Built with **Three.js**, this project features a clean cyberpunk/futuristic HUD interface with a dynamic particle network animating in the background.

## 🚀 Features

*   **Drag & Drop:** Simply drag and drop any 3D file anywhere into the browser window for instant loading.
*   **Auto-Scaling & Centering:** Models are automatically resized and centered relative to the camera view, regardless of their original scale or bounding box proportions.
*   **Draco Compression Support:** Out-of-the-box integration with `DRACOLoader` to seamlessly decode optimized, compressed 3D assets.
*   **Scene Controls:** Toggle auto-rotation on/off and instantly reset the camera position back to the default view.
*   **Realistic Lighting:** Balanced setup using high-intensity Ambient and Directional lights to display the true colors, textures, and material properties of your models.

## 🛠️ Tech Stack

*   **HTML5 & CSS3** (Custom properties, CSS clip-paths, and neon glow filters)
*   **JavaScript (ES6+)**
*   **Three.js** (r160) – handles 3D rendering, scene graph logic, lighting, and camera interactions (`OrbitControls`)
*   **HTML5 Canvas** – powers the interactive background particle constellation effect

## 📦 Getting Started / Local Deployment

Because this project relies on native ES modules (`import`), opening the `index.html` file directly in your browser via the `file://` protocol will cause CORS errors. It must be served through a local development server.

1.  Clone the repository:
```bash
    git clone [https://github.com/your-username/glb-viewer.git](https://github.com/your-username/glb-viewer.git)
    ```
2.  Navigate to the project directory:
```bash
    cd glb-viewer
    ```
3.  Launch a local server using any of the following methods:
    *   **VS Code:** Install the **Live Server** extension, then click the *Go Live* button in the bottom status bar.
    *   **Python:** Run `python -m http.server 8000` in your terminal.
    *   **Node.js:** Install `http-server` globally (`npm install -g http-server`) and run the `http-server` command.

## 📂 Project Structure

*   `index.html` – The core layout containing the 3D canvas viewport, overlay scanlines, UI control wrappers, and drop zone triggers.
*   `style.css` – Contains the full cyberpunk visual theme, including custom loader animations, holographic glow styles, and clipped button shapes.
*   `main.js` – Houses all JavaScript logic, including the Three.js scene initialization, canvas particle physics loop, drag-and-drop file stream parsing, and strict memory management (automatically disposes of old geometries/materials when a new file is uploaded to prevent memory leaks).

---
Created by Boris Randjev // 2026.