import React from 'react';
import { Table, Badge, Paper, Text, ScrollArea, Group, Title, Stack } from '@mantine/core';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';

const WorkerSubmissions = ({ workerId }) => {
  const { data } = useData();
  
  const workerReports = data.reports.filter(r => r.workerId === workerId);
  
  const getStatusColor = (status) => {
    const colors = {
      'Pending Review': 'yellow',
      'Approved': 'green',
      'Delivered': 'blue',
      'Verified': 'teal',
      'Rejected': 'red'
    };
    return colors[status] || 'gray';
  };

  if (workerReports.length === 0) {
    return (
      <Paper shadow="sm" radius="lg" p="xl" withBorder>
        <Text ta="center" c="dimmed">No submissions found. Submit your first report using the form above.</Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" radius="lg" p="xl" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>My Submissions ({workerReports.length})</Title>
      </Group>
      
      <ScrollArea h={500}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Submission ID</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>Disaster Type</Table.Th>
              <Table.Th>Relief Type</Table.Th>
              <Table.Th>Beneficiaries</Table.Th>
              <Table.Th>Submitted</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {workerReports.map((report) => (
              <Table.Tr key={report.submissionId}>
                <Table.Td>
                  <Badge variant="light">{report.submissionId}</Badge>
                </Table.Td>
                <Table.Td>{report.region}</Table.Td>
                <Table.Td>{report.disasterType}</Table.Td>
                <Table.Td>{report.reliefType}</Table.Td>
                <Table.Td>{report.beneficiaryCount}</Table.Td>
                <Table.Td>{dayjs(report.timestamp).format('MMM DD, YYYY hh:mm A')}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(report.status)}>{report.status}</Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};

export default WorkerSubmissions;