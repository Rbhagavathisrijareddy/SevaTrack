import React, { useState } from 'react';
import {
  Paper, Title, Button, Modal, TextInput, Textarea, Select,
  Table, Badge, Group, Text, Stack, Card, ScrollArea, ThemeIcon,
  Divider, Alert, ActionIcon, Tooltip
} from '@mantine/core';
import { IconPlus, IconMessage, IconCheck, IconClock, IconEye, IconAlertCircle, IconX } from '@tabler/icons-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';

const WorkerTickets = () => {
  const { data, createTicket, updateTicketStatus } = useData();
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    region: ''
  });

  const workerTickets = data?.tickets?.filter(t => t.workerName === user?.name) || [];

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      notifications.show({
        title: 'Error',
        message: 'Please fill all required fields',
        color: 'red'
      });
      return;
    }

    if (!createTicket) {
      notifications.show({
        title: 'Error',
        message: 'Unable to create ticket. Please try again.',
        color: 'red'
      });
      return;
    }

    createTicket({
      ...newTicket,
      workerName: user?.name,
      workerId: user?.workerId,
    });

    notifications.show({
      title: 'Ticket Created',
      message: 'Your ticket has been submitted to NGO',
      color: 'green'
    });

    setCreateModalOpen(false);
    setNewTicket({ title: '', description: '', priority: 'Medium', region: '' });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'red';
      case 'In Progress': return 'yellow';
      case 'Resolved': return 'green';
      case 'Closed': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <IconCheck size={14} />;
      case 'Closed': return <IconX size={14} />;
      case 'In Progress': return <IconClock size={14} />;
      default: return <IconAlertCircle size={14} />;
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <div>
          <Title order={3}>My Tickets</Title>
          <Text size="sm" c="dimmed">Track and manage your support requests</Text>
        </div>
        <Button 
          leftSection={<IconPlus size={16} />} 
          color="teal"
          onClick={() => setCreateModalOpen(true)}
        >
          Create New Ticket
        </Button>
      </Group>

      {workerTickets.length === 0 ? (
        <Card shadow="sm" radius="lg" withBorder p="xl">
          <Stack align="center" gap="xs">
            <IconMessage size={48} stroke={1} color="#adb5bd" />
            <Text ta="center" c="dimmed">No tickets created yet</Text>
            <Text size="sm" c="dimmed">Click "Create New Ticket" to raise a support request</Text>
          </Stack>
        </Card>
      ) : (
        <Card shadow="sm" radius="lg" withBorder p="xl">
          <ScrollArea h={500}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Ticket ID</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Priority</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {workerTickets.map((ticket) => (
                  <Table.Tr key={ticket.ticketId}>
                    <Table.Td>
                      <Badge variant="light" size="sm">{ticket.ticketId}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500} lineClamp={1}>{ticket.title}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getPriorityColor(ticket.priority)} size="sm">
                        {ticket.priority}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs">{dayjs(ticket.createdAt).format('MMM DD, YYYY')}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(ticket.status)} size="sm" leftSection={getStatusIcon(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="View Details">
                        <ActionIcon 
                          color="teal" 
                          variant="light"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setViewModalOpen(true);
                          }}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      )}

      {/* Create Ticket Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Support Ticket"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Title *"
            placeholder="Brief summary of the issue"
            value={newTicket.title}
            onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
            required
          />
          <Select
            label="Region"
            placeholder="Select affected region"
            data={data?.regions?.map(r => ({ value: r, label: r })) || []}
            value={newTicket.region}
            onChange={(val) => setNewTicket({...newTicket, region: val})}
            searchable
            clearable
          />
          <Select
            label="Priority *"
            data={[
              { value: 'High', label: 'High - Urgent issue requiring immediate attention' },
              { value: 'Medium', label: 'Medium - Normal priority' },
              { value: 'Low', label: 'Low - General inquiry or suggestion' }
            ]}
            value={newTicket.priority}
            onChange={(val) => setNewTicket({...newTicket, priority: val})}
          />
          <Textarea
            label="Description *"
            placeholder="Detailed description of the issue or request..."
            value={newTicket.description}
            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
            minRows={5}
            required
          />
          <Alert color="blue" variant="light">
            <Text size="xs">The NGO team will review your ticket and respond shortly. You will be notified when there's an update.</Text>
          </Alert>
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button color="teal" onClick={handleCreateTicket}>Submit Ticket</Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Ticket Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedTicket(null);
        }}
        title={`Ticket Details: ${selectedTicket?.ticketId}`}
        size="lg"
      >
        {selectedTicket && (
          <Stack>
            <Card withBorder p="md" radius="md">
              <Text fw={600} size="lg">{selectedTicket.title}</Text>
              <Group mt="xs">
                <Badge color={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority} Priority</Badge>
                <Badge color={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
                <Text size="xs" c="dimmed">Created: {dayjs(selectedTicket.createdAt).format('MMM DD, YYYY hh:mm A')}</Text>
              </Group>
              {selectedTicket.region && (
                <Text size="xs" c="dimmed" mt="xs">Region: {selectedTicket.region}</Text>
              )}
              <Divider my="md" />
              <Text size="sm" fw={500}>Issue Description:</Text>
              <Text size="sm">{selectedTicket.description}</Text>
            </Card>

            {selectedTicket.ngoResponse && (
              <Card withBorder p="md" radius="md" bg="teal.0">
                <Group mb="xs">
                  <ThemeIcon color="teal" size="sm" radius="xl">
                    <IconMessage size={12} />
                  </ThemeIcon>
                  <Text fw={600} size="sm" c="teal">NGO Response</Text>
                  {selectedTicket.responseDate && (
                    <Text size="xs" c="dimmed">
                      {dayjs(selectedTicket.responseDate).format('MMM DD, YYYY hh:mm A')}
                    </Text>
                  )}
                </Group>
                <Text size="sm">{selectedTicket.ngoResponse}</Text>
              </Card>
            )}

            {selectedTicket.status === 'Resolved' && (
              <Alert color="green" variant="light">
                <Text size="sm">✓ This ticket has been resolved. If you need further assistance, please create a new ticket.</Text>
              </Alert>
            )}

            {selectedTicket.status === 'In Progress' && (
              <Alert color="yellow" variant="light">
                <Text size="sm">🔄 This ticket is being reviewed by the NGO team. We'll update you soon.</Text>
              </Alert>
            )}

            {selectedTicket.status === 'Open' && (
              <Alert color="blue" variant="light">
                <Text size="sm">📋 Your ticket has been submitted and is awaiting review by the NGO team.</Text>
              </Alert>
            )}

            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
              {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed' && updateTicketStatus && (
                <Button 
                  color="green" 
                  onClick={() => {
                    updateTicketStatus(selectedTicket.ticketId, 'Resolved');
                    notifications.show({
                      title: 'Ticket Updated',
                      message: 'Thank you for confirming resolution',
                      color: 'green'
                    });
                    setViewModalOpen(false);
                  }}
                >
                  Mark as Resolved
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default WorkerTickets;