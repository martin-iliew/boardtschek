![Logo](https://github.com/user-attachments/assets/181f7350-798c-460c-b8e4-bcf1da6e8ce4)

# Boardtschek
Boardtschek is a full-stack web application for **renting and managing board games**. Users can browse a catalog, rent games, rate/review them, and manage favorites. Admins can manage the catalog and handle user requests.


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

