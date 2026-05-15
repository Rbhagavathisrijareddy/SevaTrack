import { AppShell, Title } from "@mantine/core";
import Sidebar from "../components/common/Sidebar";

function NgoLayout({ children }) {
  return (
    <AppShell
      navbar={{
        width: 260,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Header p="md">
        <Title order={3}>
          NGO Dashboard
        </Title>
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default NgoLayout;