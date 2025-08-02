# CalorieTracker

A nutrition optimization app for UC Berkeley students to make smarter dining decisions based on meal plans, dietary preferences, and real-time data.

---

## Tech Stack & Dependencies

- **Backend:** Node.js, Express  
- **Frontend:** React (in progress, served as static files)  
- **Database:** Planned MongoDB for menus, users, and nutrition data  
- **Web Scraping:** Axios, Cheerio  
- **Environment Variables:** dotenv  
- **Development Tools:** Nodemon for hot reload; ESLint and Prettier (planned)

---

## Architecture Overview

- Express server handles API routes and serves static frontend assets from `/public`  
- Modular route handlers located in `/routes` folder (e.g., `/api/menus/sync`)  
- Backend will connect to MongoDB for storing scraped menu data and user profiles (setup pending)  
- Frontend React app consumes API endpoints to display menus, nutrition info, and meal plans  
- Deployment planned on Vercel for frontend and optionally Heroku or similar for backend

---

## Core API Endpoints (Planned/Current)

- `GET /api/menus/sync`  
  Triggers scraper to fetch latest menus and update database (currently stubbed)  
- `GET /api/nutrition/:itemName`  
  Fetches or predicts calorie info for a menu item (upcoming)  
- `POST /api/auth/register` and `/api/auth/login`  
  User authentication endpoints (planned)

---

## Data Model Overview

- **Users:** Store dietary restrictions, meal plan info (swipes, flex dollars), and preferences  
- **Restaurants:** Campus and nearby eateries with metadata (location, hours)  
- **Menus:** Linked to restaurants, containing meal items with names, descriptions, and calories  
- **Meal Plans:** Track user meal swipes and budget for recommendations  
- **Nutrition Data:** Sourced from USDA API or AI-based calorie predictions

---

## Development Workflow

1. Clone the repo  
2. Run `npm install` to install dependencies  
3. Start backend dev server with `npm run dev` (nodemon watches for changes)  
4. Frontend currently served as static files from `/public` folder  
5. Test API endpoints locally at `http://localhost:3000`

---