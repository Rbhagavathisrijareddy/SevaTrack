import { useState } from "react";

import {
  AppShell,
  Burger,
  Group,
  Title,
  Stack,
  NavLink,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

/* Pages */
import Login from "./pages/auth/Login";

/* Worker */
import WorkerDashboard from "./pages/worker/Dashboard";
import SubmitData from "./pages/worker/SubmitData";
import History from "./pages/worker/History";
import Profile from "./pages/worker/Profile";

/* NGO */
import NgoDashboard from "./pages/ngo/Dashboard";
import Workers from "./pages/ngo/Workers";
import Activities from "./pages/ngo/Activities";
import Reports from "./pages/ngo/Reports";

/* Icons */
import {
  IconLayoutDashboard,
  IconClipboardText,
  IconHistory,
  IconUser,
  IconUsers,
  IconReport,
} from "@tabler/icons-react";

function Navigation({
  role,
}) {
  const location =
    useLocation();

  const workerLinks = [
    {
      label: "Dashboard",
      icon:
        IconLayoutDashboard,
      link:
        "/worker/dashboard",
    },
    {
      label: "Submit Data",
      icon:
        IconClipboardText,
      link:
        "/worker/submit",
    },
    {
      label: "History",
      icon:
        IconHistory,
      link:
        "/worker/history",
    },
    {
      label: "Profile",
      icon: IconUser,
      link:
        "/worker/profile",
    },
  ];

  const ngoLinks = [
    {
      label: "Dashboard",
      icon:
        IconLayoutDashboard,
      link:
        "/ngo/dashboard",
    },
    {
      label: "Workers",
      icon: IconUsers,
      link:
        "/ngo/workers",
    },
    {
      label: "Activities",
      icon:
        IconClipboardText,
      link:
        "/ngo/activities",
    },
    {
      label: "Reports",
      icon:
        IconReport,
      link:
        "/ngo/reports",
    },
  ];

  const links =
    role === "worker"
      ? workerLinks
      : ngoLinks;

  return (
    <Stack p="md">
      {links.map((item) => (
        <NavLink
          key={item.label}
          label={item.label}
          leftSection={
            <item.icon size={18} />
          }
          component={Link}
          to={item.link}
          active={
            location.pathname ===
            item.link
          }
        />
      ))}
    </Stack>
  );
}

function App() {
  const [opened, { toggle }] =
    useDisclosure(false);

  const [role] =
    useState("worker");

  return (
    <BrowserRouter>
      <AppShell
        padding="md"
        navbarOffsetBreakpoint="sm"
        navbar={
          opened && (
            <Navigation role={role} />
          )
        }
        header={
          <Group
            position="apart"
            p="md"
          >
            <Title order={3}>
              SevaTrack
            </Title>

            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
            />
          </Group>
        }
      >
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />

          {/* Worker Routes */}
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

          {/* NGO Routes */}
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
      </AppShell>
    </BrowserRouter>
  );
}

export default App;