import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  AppShell, NavLink, Burger, Group, Text, Box, Avatar, 
  Menu, UnstyledButton, ScrollArea, Badge 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IconLayoutDashboard, IconReportSearch, IconTicket, 
  IconLogout, IconUser 
} from '@tabler/icons-react';
import GlobalSearchBar from '../components/GlobalSearchBar';
import SearchReportsPage from '../components/SearchReportsPage';
import DashboardHome from '../components/DashboardHome';
import TicketsManagement from '../components/TicketsManagement';
import NGOProfile from '../components/NGOProfile';

const NGODashboard = () => {
  const [opened, { toggle }] = useDisclosure();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard, path: '/dashboard' },
    { id: 'searchReports', label: 'Search Reports', icon: IconReportSearch, path: '/dashboard/reports' },
    { id: 'tickets', label: 'Tickets', icon: IconTicket, path: '/dashboard/tickets' },
    { id: 'profile', label: 'Profile', icon: IconUser, path: '/dashboard/profile' },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/dashboard/reports') return 'searchReports';
    if (path === '/dashboard/tickets') return 'tickets';
    if (path === '/dashboard/profile') return 'profile';
    return 'dashboard';
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <Box style={{ width: 35, height: 35, background: '#00695D', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20 L70 35 L70 65 L50 80 L30 65 L30 35 Z" fill="white" />
                  <circle cx="50" cy="50" r="8" fill="#FFC107" />
                  <path d="M35 45 L65 45" stroke="white" strokeWidth="2"/>
                </svg>
              </Box>
              <Text fw={700} size="lg" variant="gradient" gradient={{ from: 'teal', to: 'green' }}>SevaTrack</Text>
              <Badge variant="light" color="teal">NGO Portal</Badge>
            </Group>
          </Group>
          <Group>
            <GlobalSearchBar />
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Avatar radius="xl" color="teal" variant="filled">AD</Avatar>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>NGO Admin</Menu.Label>
                <Menu.Item 
                  leftSection={<IconUser size={14} />} 
                  onClick={() => navigate('/dashboard/profile')}
                >
                  My Profile
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconLogout size={14} />} 
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              label={item.label}
              leftSection={<item.icon size={20} />}
              active={getActiveTab() === item.id}
              onClick={() => handleNavigation(item.path)}
              variant="filled"
              mb={5}
            />
          ))}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/reports" element={<SearchReportsPage />} />
          <Route path="/tickets" element={<TicketsManagement />} />
          <Route path="/profile" element={<NGOProfile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

export default NGODashboard;