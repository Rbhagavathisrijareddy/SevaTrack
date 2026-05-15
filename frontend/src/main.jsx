import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  MantineProvider,
} from "@mantine/core";

import {
  Notifications,
} from "@mantine/notifications";

import { ngoTheme } from "./theme/theme";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <MantineProvider
      theme={ngoTheme}
    >
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>
);