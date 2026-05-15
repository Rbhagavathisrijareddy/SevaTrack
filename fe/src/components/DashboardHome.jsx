import React from 'react';
import { Container, Title, SimpleGrid, Card, Text, Group, Badge, Table, Paper } from '@mantine/core';
import { useData } from '../contexts/DataContext';

const DashboardHome = () => {
  const { data } = useData();
  const totalReports = data.reports.length;
  const pendingReports = data.reports.filter(r => r.status === 'Pending Review').length;
  const totalBeneficiaries = data.reports.reduce((sum, r) => sum + r.beneficiaryCount, 0);
  const activeTickets = data.tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  return (
    <Container fluid>
      <Title order={2} mb="lg">Dashboard Overview</Title>
      
      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
        <Card shadow="sm" radius="lg" withBorder padding="lg">
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>Total Reports</Text>
          <Text fw={700} size="xl">{totalReports}</Text>
        </Card>
        
        <Card shadow="sm" radius="lg" withBorder padding="lg">
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>Pending Review</Text>
          <Text fw={700} size="xl" c="orange">{pendingReports}</Text>
        </Card>
        
        <Card shadow="sm" radius="lg" withBorder padding="lg">
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>Beneficiaries Served</Text>
          <Text fw={700} size="xl" c="green">{totalBeneficiaries.toLocaleString()}</Text>
        </Card>
        
        <Card shadow="sm" radius="lg" withBorder padding="lg">
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>Active Tickets</Text>
          <Text fw={700} size="xl" c="teal">{activeTickets}</Text>
        </Card>
      </SimpleGrid>
      
      {/* Recent Reports Table */}
      <Card shadow="sm" radius="lg" withBorder padding="lg">
        <Title order={3} mb="md">Recent Reports</Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Submission ID</Table.Th>
              <Table.Th>Worker Name</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>Relief Type</Table.Th>
              <Table.Th>Beneficiaries</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.reports.slice(0, 10).map((report) => (
              <Table.Tr key={report.submissionId}>
                <Table.Td>
                  <Badge variant="light" size="sm">{report.submissionId}</Badge>
                </Table.Td>
                <Table.Td>{report.workerName}</Table.Td>
                <Table.Td>{report.region}</Table.Td>
                <Table.Td>{report.reliefType}</Table.Td>
                <Table.Td>{report.beneficiaryCount}</Table.Td>
                <Table.Td>
                  <Badge 
                    color={
                      report.status === 'Pending Review' ? 'yellow' : 
                      report.status === 'Approved' ? 'green' : 
                      report.status === 'Delivered' ? 'blue' : 
                      report.status === 'Verified' ? 'teal' : 
                      report.status === 'Rejected' ? 'red' : 'gray'
                    }
                    size="sm"
                  >
                    {report.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        
        {data.reports.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No reports available</Text>
        )}
      </Card>
    </Container>
  );
};

export default DashboardHome;