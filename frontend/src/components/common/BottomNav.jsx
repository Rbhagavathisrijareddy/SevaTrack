import {
  Paper,
  Group,
  ActionIcon,
} from "@mantine/core";

import {
  IconHome,
  IconClipboardText,
  IconHistory,
  IconUser,
} from "@tabler/icons-react";

import { useNavigate } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();

  return (
    <Paper
      shadow="md"
      p="sm"
      radius="xl"
      withBorder
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Group justify="space-around">
        <ActionIcon
          variant="light"
          size="lg"
          onClick={() =>
            navigate("/worker/dashboard")
          }
        >
          <IconHome />
        </ActionIcon>

        <ActionIcon
          variant="light"
          size="lg"
          onClick={() =>
            navigate("/worker/submit")
          }
        >
          <IconClipboardText />
        </ActionIcon>

        <ActionIcon
          variant="light"
          size="lg"
          onClick={() =>
            navigate("/worker/history")
          }
        >
          <IconHistory />
        </ActionIcon>

        <ActionIcon
          variant="light"
          size="lg"
          onClick={() =>
            navigate("/worker/profile")
          }
        >
          <IconUser />
        </ActionIcon>
      </Group>
    </Paper>
  );
}

export default BottomNav;