import { AppShell, Title } from "@mantine/core";
import BottomNav from "../components/common/BottomNav";

function WorkerLayout({ children }) {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header p="md">
        <Title order={3}>
          SevaTrack
        </Title>
      </AppShell.Header>

      <AppShell.Main p="md">
        {children}
      </AppShell.Main>

      <BottomNav />
    </AppShell>
  );
}

export default WorkerLayout;