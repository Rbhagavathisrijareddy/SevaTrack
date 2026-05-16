import React, { useState, useEffect } from 'react';
import { 
  AppShell, Burger, Group, Text, Box, Avatar, Menu, 
  UnstyledButton, Tabs, Container, Title, Badge 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IconLogout, IconFileReport, IconHistory, IconTicket, IconUser } from '@tabler/icons-react';
import WorkerReportForm from '../components/WorkerReportForm';
import WorkerSubmissions from '../components/WorkerSubmissions';
import WorkerTickets from '../components/WorkerTickets';
import WorkerProfile from '../components/WorkerProfile';

const WorkerDashboard = () => {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('submit');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const editParam = searchParams.get('edit');
    
    // If edit param is present, switch to submit tab
    if (editParam) {
      setActiveTab('submit');
    } else if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap="xs">
              <Box style={{ width: 30, height: 30, background: '#00695D', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20 L70 35 L70 65 L50 80 L30 65 L30 35 Z" fill="white" />
                  <circle cx="50" cy="50" r="6" fill="#FFC107" />
                </svg>
              </Box>
              <Text fw={700} size="lg">SevaTrack</Text>
              <Text size="sm" c="dimmed">Field Worker Portal</Text>
            </Group>
          </Group>
          <Group>
            <Text size="sm" fw={500}>Welcome, {user?.name}</Text>
            <Badge variant="light" color="teal" size="sm">ID: {user?.workerId}</Badge>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Avatar radius="xl" color="teal" size="sm">FW</Avatar>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user?.name}</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />} onClick={() => setActiveTab('profile')}>
                  My Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconLogout size={14} />} onClick={handleLogout}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py="xl">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={2}>Field Worker Dashboard</Title>
              <Text c="dimmed" size="sm">Submit disaster reports, track submissions, and manage your profile</Text>
            </div>     
          </Group>

          <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
            <Tabs.List>
              <Tabs.Tab value="submit" leftSection={<IconFileReport size={16} />}>Submit Report</Tabs.Tab>
              <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>My Submissions</Tabs.Tab>
              <Tabs.Tab value="tickets" leftSection={<IconTicket size={16} />}>My Tickets</Tabs.Tab>
              <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>My Profile</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="submit" pt="xl">
              <WorkerReportForm />
            </Tabs.Panel>

            <Tabs.Panel value="history" pt="xl">
              <WorkerSubmissions workerId={user?.workerId} />
            </Tabs.Panel>

            <Tabs.Panel value="tickets" pt="xl">
              <WorkerTickets />
            </Tabs.Panel>

            <Tabs.Panel value="profile" pt="xl">
              <WorkerProfile />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default WorkerDashboard;