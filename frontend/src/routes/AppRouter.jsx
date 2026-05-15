import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/auth/Login";

import WorkerDashboard from "../pages/worker/Dashboard";
import SubmitData from "../pages/worker/SubmitData";
import History from "../pages/worker/History";
import Profile from "../pages/worker/Profile";

import NgoDashboard from "../pages/ngo/Dashboard";
import Workers from "../pages/ngo/Workers";
import Activities from "../pages/ngo/Activities";
import Reports from "../pages/ngo/Reports";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        {/* Worker */}

        <Route
          path="/worker/dashboard"
          element={
            <WorkerDashboard />
          }
        />

        <Route
          path="/worker/submit"
          element={<SubmitData />}
        />

        <Route
          path="/worker/history"
          element={<History />}
        />

        <Route
          path="/worker/profile"
          element={<Profile />}
        />

        {/* NGO */}

        <Route
          path="/ngo/dashboard"
          element={<NgoDashboard />}
        />

        <Route
          path="/ngo/workers"
          element={<Workers />}
        />

        <Route
          path="/ngo/activities"
          element={<Activities />}
        />

        <Route
          path="/ngo/reports"
          element={<Reports />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;