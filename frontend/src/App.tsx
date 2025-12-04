import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/auth/login";
import CreateAccount from "./pages/auth/signup";
import Settings from "./pages/home/settings/page";
import AddGame from "./pages/games/add/page";
import SearchResults from "./pages/games/search-results";
import EditGameById from "./pages/games/[id]/edit/page";
import GameDetails from "./pages/games/[id]/page";
import MyRentedGames from "./pages/home/page";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import { ThemeProvider } from "@/components/theme-provider/ThemeProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "./components/ui/sonner";
import AllGames from "./pages/games/page";
import Home from "./pages/page";

import { ROUTES } from "@/routes";
import Logout from "./pages/auth/logout";

function App() {
  const location = useLocation();

  const hideLayout = [ROUTES.LOGIN, ROUTES.REGISTER].includes(
    location.pathname
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      {!hideLayout && <Navbar />}

      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestGuard>
              <Login />
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <GuestGuard>
              <CreateAccount />
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.LOGOUT}
          element={
            <GuestGuard>
              <Logout />
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.HOME}
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.SETTINGS}
          element={
            <AuthGuard>
              <Settings />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.SETTINGS_RENTS}
          element={
            <AuthGuard>
              <MyRentedGames />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.ADD_GAME}
          element={
            <AuthGuard>
              <AddGame />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.EDIT_GAME}
          element={
            <AuthGuard>
              <EditGameById />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.GAME_DETAILS}
          element={
            <AuthGuard>
              <GameDetails />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.GAMES}
          element={
            <AuthGuard>
              <AllGames />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.SEARCH}
          element={
            <AuthGuard>
              <SearchResults />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.HOME}
          element={
            <AuthGuard>
              <MyRentedGames />
            </AuthGuard>
          }
        />

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </ThemeProvider>
  );
}

export default App;
