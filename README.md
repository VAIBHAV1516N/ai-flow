# ⬡ AI Flow — MERN + React Flow + OpenRouter

A full-stack AI pipeline visualizer built with MongoDB, Express, React, Node.js, and React Flow. Type a prompt into the Input node, click **Run Flow**, and watch the AI response flow into the Output node — connected by a live animated edge.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Flow (@xyflow/react) |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| AI | OpenRouter API (Gemini 2.0 Flash Lite — free) |

---

## Project Structure

```
ai-flow/
├── backend/
│   ├── server.js          # Express server with /api/ask-ai, /api/save, /api/history
│   ├── package.json
│   └── .env.example       # Copy to .env and fill in your keys
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputNode.js   # React Flow custom input node
│   │   │   └── ResultNode.js  # React Flow custom output node
│   │   ├── App.js             # Main application logic
│   │   ├── App.css            # Styles
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json           # Root convenience scripts
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- [OpenRouter](https://openrouter.ai/) account (free — get your API key)

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-flow.git
cd ai-flow
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aiflow
FRONTEND_URL=http://localhost:3000
PORT=5000
```

**Getting your keys:**
- **OpenRouter:** Sign up at [openrouter.ai](https://openrouter.ai) → Keys → Create Key (free credits included)
- **MongoDB Atlas:** Create cluster → Connect → Copy connection string

### 3. Install dependencies

```bash
# In /backend
npm install

# In /frontend
cd ../frontend
npm install
```

### 4. Run the app

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App opens on http://localhost:3000
```

---

## Usage

1. **Type** your prompt into the **Input** node on the left
2. Click **▶ Run Flow** in the header
3. Watch the animated edge as the AI response populates the **Output** node
4. Click **Save to DB** to persist the prompt + response to MongoDB

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ask-ai` | Send prompt to OpenRouter, get AI response |
| `POST` | `/api/save` | Save prompt + response to MongoDB |
| `GET` | `/api/history` | Fetch last 20 saved flows |

**POST `/api/ask-ai` body:**
```json
{ "prompt": "What is the capital of France?" }
```

**Response:**
```json
{ "answer": "The capital of France is Paris." }
```

---

## Deployment

### Deploy Backend to Render.com

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo, set root to `backend/`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `OPENROUTER_API_KEY`
   - `MONGODB_URI`
   - `FRONTEND_URL` (your Vercel frontend URL)
   - `PORT` → `5000`

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your repo, set root to `frontend/`
3. Add environment variable:
   - `REACT_APP_BACKEND_URL` = your Render backend URL (e.g. `https://ai-flow-api.onrender.com`)
4. Deploy

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `FRONTEND_URL` | Frontend URL (for CORS) |
| `PORT` | Port number (default: 5000) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | Backend URL (empty = same origin via proxy) |

---

## License

MIT
