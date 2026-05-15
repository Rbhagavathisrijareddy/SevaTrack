import {
  Stack,
  NavLink,
} from "@mantine/core";

import {
  IconLayoutDashboard,
  IconUsers,
  IconClipboardList,
  IconReport,
} from "@tabler/icons-react";

import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <Stack p="md">

      <NavLink
        label="Dashboard"
        leftSection={
          <IconLayoutDashboard size={18} />
        }
        onClick={() =>
          navigate("/ngo/dashboard")
        }
      />

      <NavLink
        label="Workers"
        leftSection={
          <IconUsers size={18} />
        }
        onClick={() =>
          navigate("/ngo/workers")
        }
      />

      <NavLink
        label="Activities"
        leftSection={
          <IconClipboardList size={18} />
        }
        onClick={() =>
          navigate("/ngo/activities")
        }
      />

      <NavLink
        label="Reports"
        leftSection={
          <IconReport size={18} />
        }
        onClick={() =>
          navigate("/ngo/reports")
        }
      />
    </Stack>
  );
}

export default Sidebar;