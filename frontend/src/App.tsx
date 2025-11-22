import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import CreateAccountPage from "./pages/auth/signup";
import SettingsPage from "./pages/home/settings";
import AddGamePage from "./pages/games/add";
import SearchResultsPage from "./pages/games/search-results";
import EditGameByIdPage from "./pages/games/[id]/edit";
import GameDetails from "./pages/games/[id]";
import MyRentedGamesPage from "./pages/home";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import { ThemeProvider } from "@/components/theme-provider/ThemeProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "./components/ui/sonner";
import AllGamesPage from "./pages/games";
import HomePage from "./pages/index";

import { ROUTES } from "@/routes";
import LogoutPage from "./pages/auth/logout";

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
              <LoginPage />
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <GuestGuard>
              <CreateAccountPage />
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.LOGOUT}
          element={
            <GuestGuard>
              <LogoutPage />
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.HOME}
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.SETTINGS}
          element={
            <AuthGuard>
              <SettingsPage />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.SETTINGS_RENTS}
          element={
            <AuthGuard>
              <MyRentedGamesPage />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.ADD_GAME}
          element={
            <AuthGuard>
              <AddGamePage />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.EDIT_GAME}
          element={
            <AuthGuard>
              <EditGameByIdPage />
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
              <AllGamesPage />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.SEARCH}
          element={
            <AuthGuard>
              <SearchResultsPage />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTES.HOME}
          element={
            <AuthGuard>
              <MyRentedGamesPage />
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
