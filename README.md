<svg width="180" height="180" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M70.1116 0C76.5032 7.42053 83.5528 14.3117 91.1764 20.5937C86.0967 36.2108 83.362 52.8026 83.362 70C83.362 87.1973 86.0967 103.789 91.1764 119.407C83.5528 125.688 76.5032 132.579 70.1116 140C63.72 132.579 56.6702 125.688 49.0469 119.407C54.1265 103.789 56.8611 87.1973 56.8611 70C56.8611 52.8027 54.1265 36.2108 49.0469 20.5937C56.6702 14.3117 63.72 7.42053 70.1116 0Z" fill="#F58220"/>
<path d="M34.3641 108.609C26.2946 103.248 17.7307 98.5097 8.75 94.469C11.2412 86.7287 12.5813 78.5125 12.5813 69.9999C12.5813 61.4873 11.2412 53.2711 8.75 45.531C17.7307 41.49 26.2946 36.7521 34.3641 31.3909C37.4496 43.7855 39.0823 56.712 39.0823 69.9999C39.0823 83.2876 37.4496 96.2143 34.3641 108.609Z" fill="#FCB94D"/>
<path d="M100.918 70C100.918 83.2877 102.55 96.2144 105.636 108.609C113.705 103.248 122.269 98.5098 131.25 94.469C128.758 86.7288 127.419 78.5125 127.419 70C127.419 61.4874 128.758 53.2712 131.25 45.531C122.269 41.4901 113.705 36.7521 105.636 31.3909C102.55 43.7855 100.918 56.712 100.918 70Z" fill="#FCB94D"/>

# Boardtschek

Boardtschek is a full-stack web application for **renting and managing board games**. Users can browse a catalog, rent games, rate/review them, and manage favorites. Admins can manage the catalog and handle user requests.

</svg>

> **Note**  
> The project was originally built as an internal-style app example (e.g., for company employees). The codebase is generic and can be adapted.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI
- Axios
- React Hook Form + Zod

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- ASP.NET Identity
- JWT Bearer Authentication
- Swagger / OpenAPI

---

## Features

### User

- Browse board games and view details (players, difficulty, availability, ratings)
- Search games by name
- Favorite / like games
- Rent up to **5** games at a time
- Return rented games
- Rate (1–5) and review games
- View profile: active rentals + rental history (overdue surfaced first)
- Homepage highlights: most borrowed and most liked / highest rated games

### Admin

- Add, edit, delete games
- Manage inventory/availability
- Review and manage game requests (if enabled in the backend)

---

## Project Structure

```text
boardtschek/
├── backend/
│   ├── Boardtschek.Common/                # Shared constants and validations
│   ├── Boardtschek.Data/                  # EF Core DbContext and migrations
│   ├── Boardtschek.Data.Models/           # Entity models (AppUser, Game, Rental, etc.)
│   ├── Boardtschek.Services.Data/         # Business logic services
│   ├── Boardtschek.WebAPI/                # API controllers and configuration
│   ├── Boardtschek.WebAPI.Infrastructure/ # Extensions and utilities
│   └── Boardtschek.WebAPI.ViewModels/     # DTOs and request/response models
├── frontend/
│   └── src/
│       ├── api/                           # API client + endpoint wrappers
│       ├── components/                    # Reusable UI components
│       ├── context/                       # React context providers (Auth)
│       ├── guards/                        # Route guards (AuthGuard, GuestGuard)
│       ├── hooks/                         # Custom React hooks
│       ├── lib/                           # Utilities
│       ├── pages/                         # Page components
│       └── types/                         # Type definitions
└── README.md
```

---

## Authentication

- Backend uses **ASP.NET Identity** + **JWT Bearer tokens**
- Admin-only operations are protected via authorization (role-based where configured)
- Frontend uses route guards to restrict access to authenticated pages

---

## Database Model (Simplified)

### Entities

**AppUser**

- Identity user + profile fields (e.g., names, image URL depending on implementation)
- Relations: Rentals, Ratings, Likes/Favorites

**Game**

- Title, Description, ImageUrl
- MinPlayers, MaxPlayers, DifficultyLevel
- AvailableQuantity, TotalQuantity
- Relations: Rentals, Ratings, Likes/Favorites

**Rental**

- RentalDate, ExpectedReturnDate, ActualReturnDate
- Relations: User, Game

**Rating**

- Score (1–5), Comment, RatingDate
- Relations: User, Game

**LikedGame** (join)

- User ↔ Game (many-to-many)

---

## Prerequisites

### Backend

- .NET SDK
- SQL Server instance running locally
- EF Core tooling (if you run migrations via CLI)

### Frontend

- Node.js
- Package manager (pnpm / npm / yarn)

---

## Local Setup

### 1) Clone

```bash
git clone <your-repo-url>
cd boardtschek
```

### 2) Backend

From repo root:

```powershell
cd backend/Boardtschek.WebAPI
```

Configure `appsettings.json` (example):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=BoardtschekDB;Trusted_Connection=True;TrustServerCertificate=true"
  },
  "JWT_Secret": "YOUR_SECRET_KEY"
}
```

Apply migrations:

```powershell
dotnet ef database update --project ../Boardtschek.Data
```

Run the API:

```powershell
dotnet run
```

Swagger:

- `http://localhost:5050/swagger` 

### 3) Frontend

From repo root:

```powershell
cd frontend
pnpm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5050/
VITE_APP_NAME=Boardtschek
```

Run dev server:

```powershell
pnpm dev
```

Frontend:

- `http://localhost:5173`

---

## Usage

### Users

1. Sign up / log in
2. Browse games
3. Rent and return games
4. Favorite and review games
5. Track rentals in profile/settings

### Admins

1. Log in with an admin account
2. Manage games (add/edit/delete) and inventory
3. Review requests (if enabled)

---

## API Documentation

Use Swagger/OpenAPI as the source of truth:

- `GET /swagger` on the backend host

---

