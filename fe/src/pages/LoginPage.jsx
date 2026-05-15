import React, { useState } from 'react';
import { Container, Paper, TextInput, PasswordInput, Button, Title, Text, Box, Divider, Center, SegmentedControl, Group } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker'); // 'ngo' or 'worker'
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (login(email, password, role)) {
      notifications.show({ 
        title: 'Welcome back', 
        message: `Logged in as ${role === 'ngo' ? 'NGO Admin' : 'Field Worker'}`,
        color: 'teal' 
      });
      navigate(role === 'ngo' ? '/dashboard' : '/worker');
    } else {
      notifications.show({ title: 'Error', message: 'Invalid credentials', color: 'red' });
    }
  };

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #00695D 0%, #00AF9B 100%)' }}>
      <Center style={{ minHeight: '100vh' }}>
        <Container size={420} my={40}>
          <Paper radius="lg" p={30} shadow="xl" withBorder>
            <Center mb="md">
              <Box style={{ width: 60, height: 60, background: '#00695D', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20 L70 35 L70 65 L50 80 L30 65 L30 35 Z" fill="white" />
                  <path d="M50 30 L62 40 L62 60 L50 70 L38 60 L38 40 Z" fill="#00695D" />
                  <circle cx="50" cy="50" r="10" fill="white" />
                  <path d="M50 44 L56 50 L50 56 L44 50 Z" fill="#FFC107" />
                  <path d="M35 45 L45 45 M55 45 L65 45 M50 40 L50 50" stroke="white" strokeWidth="2"/>
                </svg>
              </Box>
            </Center>
            <Title ta="center" order={1} fw={700}>SevaTrack</Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>Smart Disaster Relief Management</Text>
            <Divider my="lg" />
            
            <form onSubmit={handleSubmit}>
              <SegmentedControl
                fullWidth
                value={role}
                onChange={setRole}
                data={[
                  { label: 'Field Worker', value: 'worker' },
                  { label: 'NGO Admin', value: 'ngo' },
                ]}
                mb="md"
                color="teal"
              />
              <TextInput 
                label="Email" 
                placeholder={role === 'ngo' ? "admin@sevatrack.org" : "worker@example.com"} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                size="md" 
              />
              <PasswordInput 
                label="Password" 
                placeholder="Enter password" 
                mt="md" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                size="md" 
              />
              <Button fullWidth mt="xl" size="md" type="submit" color="teal">
                Sign In as {role === 'ngo' ? 'NGO Admin' : 'Field Worker'}
              </Button>
            </form>
            <Text c="dimmed" size="xs" ta="center" mt="md">Demo: any email/password works</Text>
            <Text c="dimmed" size="xs" ta="center" mt="xs">Worker demo: worker@example.com | NGO demo: admin@sevatrack.org</Text>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
};

export default LoginPage;