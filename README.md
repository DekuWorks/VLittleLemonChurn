# Lemon Churn

A recipe presentation site for Lemon Ginger No Churn Ice Cream by Victoria Little, with an optional C# ASP.NET Core API for recipe and nutrition data.

## Project Structure

```
├── assets/          # Images (optional)
├── src/
│   ├── css/         # styles.css
│   ├── js/          # app.js, api.js, config.js, slides-loader.js
│   └── slides/      # cover.html, why.html, recipe.html (one file per slide)
├── server/          # ASP.NET Core Minimal API
└── index.html       # Shell: header, footer, slides container
```

---

## Running Locally

### Frontend (static)

1. Serve the project root with any static server:

   **Python:**
   ```bash
   python3 -m http.server 8080
   ```

   **Node (npx):**
   ```bash
   npx serve .
   ```

2. Open `http://localhost:8080` in a browser.

### Backend (API)

1. From the project root:
   ```bash
   cd server
   dotnet run
   ```

2. The API runs at `http://localhost:5000`.

3. Endpoints:
   - `GET /api/recipe` – recipe JSON
   - `GET /api/nutrition` – nutrition JSON
   - `POST /api/feedback` – submit feedback (in-memory for now)

4. Swagger UI: `http://localhost:5000/swagger`

---

## Deployment

### Frontend: GitHub Pages

1. In the repo: **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` (or your default branch)
4. **Folder:** `/ (root)`
5. Save

The site will be available at `https://<username>.github.io/<repo>/` (or your custom domain if configured).

### Production API URL

If the frontend and API are on different origins (e.g. GitHub Pages + Render):

1. Add before other scripts in `index.html`:
   ```html
   <script>window.__API_BASE__ = 'https://your-api-url.onrender.com';</script>
   ```
2. Or set on the `<html>` element:
   ```html
   <html lang="en" data-api-base="https://your-api-url.onrender.com">
   ```

### Backend: Render / Fly.io / Azure App Service

**Render**

1. New → Web Service
2. Connect the repo
3. Root directory: `server`
4. Build: `dotnet publish -c Release -o out`
5. Start: `dotnet out/LemonChurn.Api.dll`

**Fly.io**

```bash
cd server
fly launch
fly deploy
```

**Azure App Service**

Publish the `server` project as an Azure Web App via Visual Studio or Azure CLI.

---

## Backend API

The API is in `server/` and provides:

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/recipe`    | Recipe JSON              |
| GET    | `/api/nutrition` | Nutrition JSON           |
| POST   | `/api/feedback`  | Submit feedback (body: `{ "email": "?", "message": "?" }`) |

Feedback is accepted but not yet persisted to a database.
