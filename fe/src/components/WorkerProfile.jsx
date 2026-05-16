import React, { useState } from 'react';
import {
  Container, Title, Paper, TextInput, Textarea, Button, Group,
  Avatar, Box, Grid, Divider, Badge, Stack, FileInput,
  Alert, SimpleGrid, Card, Text, ThemeIcon, Tooltip, Progress
} from '@mantine/core';
import { 
  IconUser, IconMail, IconPhone, IconMapPin, IconId,
  IconEdit, IconCheck, IconX, IconCamera, IconBriefcase,
  IconClock, IconCheckbox, IconAward, IconCalendar,
  IconChartBar, IconStar, IconHeart
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import StatusBadge from './StatusBadge';

const WorkerProfile = () => {
  const { user } = useAuth();
  const { data } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.name || 'Field Worker',
    email: user?.email || 'worker@sevatrack.org',
    phone: '+91 98765 43210',
    address: '123 Worker Colony',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    emergencyContact: '+91 99887 66554',
    skills: 'First Aid, Disaster Response, Logistics',
    languages: 'English, Hindi, Marathi',
    bio: 'Dedicated field worker with 3 years of experience in disaster relief and emergency response operations.',
    joinDate: '2023-01-15'
  });

  // Get worker's statistics
  const workerReports = data.reports.filter(r => r.workerId === user?.workerId);
  const totalReports = workerReports.length;
  const approvedReports = workerReports.filter(r => r.status === 'Approved').length;
  const pendingReports = workerReports.filter(r => r.status === 'Pending Review').length;
  const totalBeneficiaries = workerReports.reduce((sum, r) => sum + r.beneficiaryCount, 0);
  const acknowledgmentRate = workerReports.filter(r => r.workerAcknowledgment).length;
  
  const approvalRate = totalReports > 0 ? (approvedReports / totalReports) * 100 : 0;

  const handleSave = () => {
    setIsEditing(false);
    notifications.show({
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully',
      color: 'green'
    });
  };

  return (
    <Container fluid>
      <Title order={2} mb="lg">Field Worker Profile</Title>
      
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
              <IconUser size={50} />
            </Avatar>
            <div>
              <Title order={3}>{profileData.fullName}</Title>
              <Group mt="xs">
                <Badge color="teal" size="lg">Field Worker</Badge>
                <Badge variant="light" size="lg">ID: {user?.workerId}</Badge>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                Joined {dayjs(profileData.joinDate).format('MMMM DD, YYYY')}
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
              <Button variant="outline" color="red" onClick={() => setIsEditing(false)} leftSection={<IconX size={16} />}>
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
        {/* Statistics Section */}
        <Grid.Col span={12}>
          <Paper shadow="sm" radius="lg" withBorder p="xl" mb="xl">
            <Title order={4} mb="md">Performance Statistics</Title>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }}>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Total Reports</Text>
                <Text fw={700} size="xl">{totalReports}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Approved</Text>
                <Text fw={700} size="xl" c="green">{approvedReports}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Pending</Text>
                <Text fw={700} size="xl" c="orange">{pendingReports}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Beneficiaries</Text>
                <Text fw={700} size="xl" c="teal">{totalBeneficiaries.toLocaleString()}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Acknowledgments</Text>
                <Text fw={700} size="xl" c="grape">{acknowledgmentRate}</Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Text size="xs" c="dimmed" tt="uppercase">Approval Rate</Text>
                <Text fw={700} size="xl" c="blue">{Math.round(approvalRate)}%</Text>
              </Card>
            </SimpleGrid>
            
            <Divider my="md" />
            
            <Group justify="space-between" mt="md">
              <Text size="sm" fw={500}>Overall Performance</Text>
              <Text size="sm" c="dimmed">{Math.round(approvalRate)}% Approval Rate</Text>
            </Group>
            <Progress value={approvalRate} color={approvalRate > 70 ? 'green' : approvalRate > 40 ? 'yellow' : 'red'} size="lg" radius="xl" />
          </Paper>
        </Grid.Col>

        {/* Personal Information */}
        <Grid.Col span={7}>
          <Paper shadow="sm" radius="lg" withBorder p="xl">
            <Title order={4} mb="md">Personal Information</Title>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  disabled={!isEditing}
                  leftSection={<IconUser size={16} />}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Worker ID"
                  value={user?.workerId}
                  disabled
                  leftSection={<IconId size={16} />}
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
                  label="Bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  minRows={2}
                />
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>

        {/* Skills & Contact */}
        <Grid.Col span={5}>
          <Paper shadow="sm" radius="lg" withBorder p="xl">
            <Title order={4} mb="md">Skills & Contact</Title>
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
                label="Emergency Contact"
                value={profileData.emergencyContact}
                onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                disabled={!isEditing}
                leftSection={<IconPhone size={16} />}
              />
              <Textarea
                label="Skills"
                value={profileData.skills}
                onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
                disabled={!isEditing}
                placeholder="First Aid, Disaster Response, etc."
              />
              <TextInput
                label="Languages Known"
                value={profileData.languages}
                onChange={(e) => setProfileData({...profileData, languages: e.target.value})}
                disabled={!isEditing}
              />
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Recent Activity */}
        <Grid.Col span={12}>
          <Paper shadow="sm" radius="lg" withBorder p="xl">
            <Title order={4} mb="md">Recent Activity</Title>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <Card withBorder radius="md" padding="sm">
                <Group mb="xs">
                  <ThemeIcon color="teal" size="sm" radius="xl">
                    <IconClock size={12} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">Last Report Submitted</Text>
                </Group>
                <Text size="sm">
                  {workerReports.length > 0 
                    ? dayjs(workerReports[0].timestamp).format('MMMM DD, YYYY hh:mm A')
                    : 'No reports yet'}
                </Text>
              </Card>
              <Card withBorder radius="md" padding="sm">
                <Group mb="xs">
                  <ThemeIcon color="green" size="sm" radius="xl">
                    <IconCheckbox size={12} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">Most Active Region</Text>
                </Group>
                <Text size="sm">
                  {workerReports.length > 0 
                    ? Object.entries(workerReports.reduce((acc, r) => {
                        acc[r.region] = (acc[r.region] || 0) + 1;
                        return acc;
                      }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
                    : 'N/A'}
                </Text>
              </Card>
            </SimpleGrid>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default WorkerProfile;