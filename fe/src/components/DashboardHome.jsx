import React, { useState } from 'react';
import { 
  Container, Title, SimpleGrid, Card, Text, Group, Badge, Table, 
  Paper, Menu, ActionIcon, Modal, Select, Textarea, Button 
} from '@mantine/core';
import { useData } from '../contexts/DataContext';
import { 
  IconCheck, IconX, IconClock, IconTruck, IconEye, 
  IconDots, IconMessage, IconRefresh 
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import StatusBadge from './StatusBadge';

const DashboardHome = () => {
  const { data, updateReportStatus, addCustomResponse } = useData();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [customResponse, setCustomResponse] = useState('');

  const totalReports = data.reports.length;
  const pendingReports = data.reports.filter(r => r.status === 'Pending Review').length;
  const totalBeneficiaries = data.reports.reduce((sum, r) => sum + r.beneficiaryCount, 0);
  const activeTickets = data.tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  // Get recent reports (last 10)
  const recentReports = [...data.reports].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

  const handleStatusUpdate = () => {
    if (!newStatus) {
      notifications.show({
        title: 'Error',
        message: 'Please select a status',
        color: 'red'
      });
      return;
    }

    updateReportStatus(selectedReport.submissionId, newStatus);
    
    notifications.show({
      title: 'Status Updated',
      message: `Report ${selectedReport.submissionId} marked as ${newStatus}`,
      color: 'green'
    });
    
    setStatusModalOpen(false);
    setSelectedReport(null);
    setNewStatus('');
  };

  const handleSendResponse = () => {
    if (!customResponse.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter a response message',
        color: 'red'
      });
      return;
    }
    
    addCustomResponse(selectedReport.submissionId, customResponse);
    
    notifications.show({
      title: 'Response Sent',
      message: `Your response has been sent to the field worker`,
      color: 'green'
    });
    
    setResponseModalOpen(false);
    setCustomResponse('');
    setSelectedReport(null);
  };

  const statusOptions = [
    { value: 'Pending Review', label: 'Pending Review', color: 'yellow' },
    { value: 'Approved', label: 'Approved ✓', color: 'green' },
    { value: 'Delivered', label: 'Delivered 📦', color: 'blue' },
    { value: 'Verified', label: 'Verified ✓', color: 'teal' },
    { value: 'Rejected', label: 'Rejected ✗', color: 'red' }
  ];

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
      
      {/* Recent Reports Table with Actions */}
      <Card shadow="sm" radius="lg" withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Title order={3}>Recent Reports</Title>
          <Text size="xs" c="dimmed">Last 10 reports</Text>
        </Group>
        
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Submission ID</Table.Th>
              <Table.Th>Worker Name</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>Relief Type</Table.Th>
              <Table.Th>Beneficiaries</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentReports.map((report) => (
              <Table.Tr key={report.submissionId}>
                <Table.Td>
                  <Badge variant="light" size="sm">{report.submissionId}</Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>{report.workerName}</Text>
                  <Text size="xs" c="dimmed">{report.workerId}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{report.region}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="outline" size="sm">{report.reliefType}</Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>{report.beneficiaryCount}</Text>
                </Table.Td>
                <Table.Td>
                  <StatusBadge status={report.status} size="md" />
                </Table.Td>
                <Table.Td>
                  <Menu position="bottom-end" shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Quick Actions</Menu.Label>
                      
                      {/* Quick Status Update */}
                      <Menu.Item 
                        leftSection={<IconCheck size={14} color="green" />}
                        onClick={() => {
                          setSelectedReport(report);
                          setNewStatus('Approved');
                          handleStatusUpdate();
                        }}
                      >
                        Approve
                      </Menu.Item>
                      <Menu.Item 
                        leftSection={<IconTruck size={14} color="blue" />}
                        onClick={() => {
                          setSelectedReport(report);
                          setNewStatus('Delivered');
                          handleStatusUpdate();
                        }}
                      >
                        Mark Delivered
                      </Menu.Item>
                      <Menu.Item 
                        leftSection={<IconEye size={14} color="teal" />}
                        onClick={() => {
                          setSelectedReport(report);
                          setNewStatus('Verified');
                          handleStatusUpdate();
                        }}
                      >
                        Verify
                      </Menu.Item>
                      <Menu.Item 
                        leftSection={<IconX size={14} color="red" />}
                        onClick={() => {
                          setSelectedReport(report);
                          setNewStatus('Rejected');
                          handleStatusUpdate();
                        }}
                      >
                        Reject
                      </Menu.Item>
                      
                      <Menu.Divider />
                      
                      {/* Custom Status Update */}
                      <Menu.Item 
                        leftSection={<IconRefresh size={14} color="blue" />}
                        onClick={() => {
                          setSelectedReport(report);
                          setNewStatus('');
                          setStatusModalOpen(true);
                        }}
                      >
                        Custom Status...
                      </Menu.Item>
                      
                      {/* Send Response */}
                      <Menu.Item 
                        leftSection={<IconMessage size={14} color="teal" />}
                        onClick={() => {
                          setSelectedReport(report);
                          setResponseModalOpen(true);
                        }}
                      >
                        Send Response
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        
        {recentReports.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No reports available</Text>
        )}
      </Card>

      {/* Custom Status Update Modal */}
      <Modal
        opened={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedReport(null);
          setNewStatus('');
        }}
        title="Update Report Status"
        size="md"
      >
        {selectedReport && (
          <>
            <Text size="sm" mb="md">
              Report: <strong>{selectedReport.submissionId}</strong><br />
              Worker: <strong>{selectedReport.workerName}</strong><br />
              Current Status: <StatusBadge status={selectedReport.status} size="sm" />
            </Text>
            
            <Select
              label="Select New Status"
              placeholder="Choose status"
              data={statusOptions.map(opt => ({ value: opt.value, label: opt.label }))}
              value={newStatus}
              onChange={setNewStatus}
              required
            />
            
            <Group justify="flex-end" mt="xl">
              <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
              <Button color="teal" onClick={handleStatusUpdate}>Update Status</Button>
            </Group>
          </>
        )}
      </Modal>

      {/* Send Response Modal */}
      <Modal
        opened={responseModalOpen}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedReport(null);
          setCustomResponse('');
        }}
        title="Send Response to Worker"
        size="lg"
      >
        {selectedReport && (
          <>
            <Text size="sm" mb="md">
              Report: <strong>{selectedReport.submissionId}</strong><br />
              Worker: <strong>{selectedReport.workerName}</strong><br />
              Region: <strong>{selectedReport.region}</strong>
            </Text>
            
            <Textarea
              label="Response Message"
              placeholder="Type your response to the field worker..."
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
              minRows={4}
              description="This message will be visible to the field worker"
            />
            
            <Group justify="flex-end" mt="xl">
              <Button variant="outline" onClick={() => setResponseModalOpen(false)}>Cancel</Button>
              <Button color="teal" onClick={handleSendResponse} leftSection={<IconMessage size={16} />}>
                Send Response
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default DashboardHome;