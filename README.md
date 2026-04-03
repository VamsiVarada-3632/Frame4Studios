# FRAME 4 STUDIOS — Full-Stack React Application

A production-ready full-stack cinematic creative agency website built with React + Node.js + MongoDB.

## 🎬 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 19, React Router DOM, Tailwind CSS v4, Framer Motion, Lucide React, Swiper, React Player, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, bcryptjs |
| Design | Cormorant Garamond + Syne + DM Sans, #C41E3A crimson red, cinematic noir |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or MongoDB Atlas URI

### 1. Start the Backend

```bash
cd server
npm install
npm run seed   # Creates admin user + sample data
npm run dev    # Starts on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev    # Starts on http://localhost:5173
```

### 3. Access the site

| Route | Description |
|---|---|
| `http://localhost:5173/` | Home page |
| `http://localhost:5173/works` | Works portfolio |
| `http://localhost:5173/fashion` | Fashion category |
| `http://localhost:5173/contact` | Contact form |
| `http://localhost:5173/admin/login` | Admin panel login |

### Admin Credentials (after seeding)
```
Email:    admin@frame4studios.com
Password: Frame4Studios@2024
```

## 📁 Project Structure

```
f4s/
├── client/                    ← Vite + React Frontend
│   └── src/
│       ├── components/        ← Reusable UI components
│       ├── pages/             ← Public pages
│       ├── admin/             ← Admin panel pages
│       ├── layouts/           ← MainLayout + AdminLayout
│       ├── routes/            ← React Router config
│       ├── services/          ← Axios API services
│       ├── hooks/             ← useFilter, useVideoModal
│       └── context/           ← AuthContext (JWT)
│
└── server/                    ← Express + MongoDB Backend
    └── src/
        ├── models/            ← Mongoose schemas
        ├── routes/            ← REST API routes
        ├── middleware/        ← JWT auth + Multer upload
        ├── app.js             ← Express entry point
        └── seed.js            ← Database seeder
```

## 🎥 Video System

The admin panel accepts YouTube URLs and Google Drive share links.

- **YouTube**: `https://www.youtube.com/watch?v=VIDEO_ID`
- **Google Drive**: `https://drive.google.com/file/d/FILE_ID/view`
  - Auto-converts to embeddable `/preview` format

## 🔐 API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register       ← First-time setup only

GET    /api/works               ← ?category=fashion&featured=true
POST   /api/works               ← Admin (multipart/form-data)
PUT    /api/works/:id           ← Admin
DELETE /api/works/:id           ← Admin

GET    /api/categories
POST   /api/categories          ← Admin
PUT    /api/categories/:id      ← Admin
DELETE /api/categories/:id      ← Admin

GET    /api/homepage
PUT    /api/homepage            ← Admin

POST   /api/contact             ← Public
GET    /api/contact             ← Admin
PUT    /api/contact/:id/read    ← Admin
DELETE /api/contact/:id         ← Admin
```

## 🌐 Environment Variables

Create `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/frame4studios
JWT_SECRET=your_secret_here
PORT=5000
NODE_ENV=development
```

## 📦 Production Deployment

1. Build frontend: `cd client && npm run build`
2. Serve `dist/` folder from Express or a CDN
3. Set `MONGO_URI` to MongoDB Atlas in production
4. Configure CORS in `server/src/app.js` for your domain
