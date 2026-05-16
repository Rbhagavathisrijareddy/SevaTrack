import React, { useState } from 'react';
import {
  Container, Title, Paper, TextInput, Textarea, Button, Group,
  Avatar, Box, Grid, Divider, Badge, Stack, FileInput,
  Alert, Tabs, SimpleGrid, Card, Text, ThemeIcon, Tooltip
} from '@mantine/core';
import { 
  IconUser, IconMail, IconPhone, IconMapPin, IconBuilding,
  IconEdit, IconCheck, IconX, IconCamera, IconShield,
  IconUsers, IconReportAnalytics, IconTicket, IconUpload,
  IconBrandGoogle, IconBrandTwitter, IconBrandLinkedin
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { notifications } from '@mantine/notifications';
import StatusBadge from './StatusBadge';

const NGOProfile = () => {
  const { user } = useAuth();
  const { data } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    organizationName: 'SevaTrack Foundation',
    registrationNumber: 'NGO-2024-001',
    email: 'admin@sevatrack.org',
    phone: '+91 98765 43210',
    address: '123 Relief Road, Civil Lines',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India',
    website: 'www.sevatrack.org',
    description: 'SevaTrack is a leading disaster relief organization committed to providing rapid response and sustainable recovery solutions for communities affected by natural disasters.',
    foundedYear: '2020',
    totalVolunteers: '250',
    operationalAreas: 'Pan India',
    socialLinks: {
      twitter: 'https://twitter.com/sevatrack',
      linkedin: 'https://linkedin.com/company/sevatrack',
      google: 'https://g.page/sevatrack'
    }
  });

  const stats = {
    totalReports: data.reports.length,
    pendingReports: data.reports.filter(r => r.status === 'Pending Review').length,
    approvedReports: data.reports.filter(r => r.status === 'Approved').length,
    totalBeneficiaries: data.reports.reduce((sum, r) => sum + r.beneficiaryCount, 0),
    activeTickets: data.tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length
  };

  const handleSave = () => {
    setIsEditing(false);
    notifications.show({
      title: 'Profile Updated',
      message: 'Your organization profile has been updated successfully',
      color: 'green'
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    notifications.show({
      title: 'Changes Discarded',
      message: 'Your profile changes have been discarded',
      color: 'blue'
    });
  };

  return (
    <Container fluid>
      <Title order={2} mb="lg">Organization Profile</Title>
      
      {/* Profile Header */}
      <Paper shadow="sm" radius="lg" withBorder p="xl" mb="xl">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar 
              size={100} 
              radius="xl" 
              color="teal"
              style={{ border: '3px solid #00695D' }}
            >
              <IconBuilding size={50} />
            </Avatar>
            <div>
              <Title order={3}>{profileData.organizationName}</Title>
              <Group mt="xs">
                <Badge color="teal" size="lg">Verified NGO</Badge>
                <Badge variant="light" size="lg">ID: {profileData.registrationNumber}</Badge>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                Member since {profileData.foundedYear}
              </Text>
            </div>
          </Group>
          
          {!isEditing ? (
            <Button 
              leftSection={<IconEdit size={16} />} 
              variant="light" 
              color="teal"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Group>
              <Button variant="outline" color="red" onClick={handleCancel} leftSection={<IconX size={16} />}>
                Cancel
              </Button>
              <Button color="teal" onClick={handleSave} leftSection={<IconCheck size={16} />}>
                Save Changes
              </Button>
            </Group>
          )}
        </Group>
      </Paper>

      <Grid>
        {/* Stats Section */}
        <Grid.Col span={12}>
          <Paper shadow="sm" radius="lg" withBorder p="xl" mb="xl">
            <Title order={4} mb="md">Organization Impact</Title>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }}>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Total Reports</Text>
                <Text fw={700} size="xl">{stats.totalReports}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Pending</Text>
                <Text fw={700} size="xl" c="orange">{stats.pendingReports}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Approved</Text>
                <Text fw={700} size="xl" c="green">{stats.approvedReports}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Beneficiaries</Text>
                <Text fw={700} size="xl" c="teal">{stats.totalBeneficiaries.toLocaleString()}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Active Tickets</Text>
                <Text fw={700} size="xl" c="blue">{stats.activeTickets}</Text>
              </Card>
            </SimpleGrid>
          </Paper>
        </Grid.Col>

        {/* Profile Information */}
        <Grid.Col span={8}>
          <Paper shadow="sm" radius="lg" withBorder p="xl">
            <Title order={4} mb="md">Organization Information</Title>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Organization Name"
                  value={profileData.organizationName}
                  onChange={(e) => setProfileData({...profileData, organizationName: e.target.value})}
                  disabled={!isEditing}
                  leftSection={<IconBuilding size={16} />}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Registration Number"
                  value={profileData.registrationNumber}
                  onChange={(e) => setProfileData({...profileData, registrationNumber: e.target.value})}
                  disabled={!isEditing}
                  leftSection={<IconShield size={16} />}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Email Address"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  leftSection={<IconMail size={16} />}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                  leftSection={<IconPhone size={16} />}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Organization Description"
                  value={profileData.description}
                  onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                  disabled={!isEditing}
                  minRows={3}
                />
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>

        {/* Address & Contact */}
        <Grid.Col span={4}>
          <Paper shadow="sm" radius="lg" withBorder p="xl">
            <Title order={4} mb="md">Address & Contact</Title>
            <Stack gap="md">
              <TextInput
                label="Address"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                disabled={!isEditing}
                leftSection={<IconMapPin size={16} />}
              />
              <TextInput
                label="City"
                value={profileData.city}
                onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                disabled={!isEditing}
              />
              <TextInput
                label="State"
                value={profileData.state}
                onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                disabled={!isEditing}
              />
              <TextInput
                label="Pincode"
                value={profileData.pincode}
                onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                disabled={!isEditing}
              />
              <TextInput
                label="Country"
                value={profileData.country}
                onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                disabled={!isEditing}
              />
              <TextInput
                label="Website"
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                disabled={!isEditing}
                leftSection={<IconBuilding size={16} />}
              />
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Additional Info */}
        <Grid.Col span={12}>
          <Paper shadow="sm" radius="lg" withBorder p="xl">
            <Title order={4} mb="md">Operational Details</Title>
            <Grid>
              <Grid.Col span={4}>
                <TextInput
                  label="Founded Year"
                  value={profileData.foundedYear}
                  onChange={(e) => setProfileData({...profileData, foundedYear: e.target.value})}
                  disabled={!isEditing}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Total Volunteers"
                  value={profileData.totalVolunteers}
                  onChange={(e) => setProfileData({...profileData, totalVolunteers: e.target.value})}
                  disabled={!isEditing}
                  leftSection={<IconUsers size={16} />}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Operational Areas"
                  value={profileData.operationalAreas}
                  onChange={(e) => setProfileData({...profileData, operationalAreas: e.target.value})}
                  disabled={!isEditing}
                />
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default NGOProfile;