import React, { useState } from 'react';
import {
  Container, Title, Paper, Grid, Select, Button, Table, Badge,
  Pagination, Group, Text, TextInput, Card, Modal, Textarea,
  ActionIcon, Tooltip, ScrollArea, Menu, Stack, ThemeIcon
} from '@mantine/core';
import {
  IconTicket, IconSearch, IconRefresh, IconMessage,
  IconCheck, IconX, IconClock, IconEye, IconDots
} from '@tabler/icons-react';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';

const TicketsManagement = () => {
  const { data, updateTicketStatus, addTicketResponse } = useData();
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    priority: 'all'
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tickets = data?.tickets || [];
  
  const filteredTickets = tickets.filter(ticket => {
    if (filters.searchTerm && !ticket.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !ticket.ticketId?.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !ticket.region?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
    return true;
  });

  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

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

  const handleStatusUpdate = (ticketId, newStatus) => {
    if (updateTicketStatus) {
      updateTicketStatus(ticketId, newStatus);
      notifications.show({
        title: 'Status Updated',
        message: `Ticket ${ticketId} marked as ${newStatus}`,
        color: 'green'
      });
    }
  };

  const handleSendResponse = () => {
    if (!responseMessage.trim()) {
      notifications.show({ title: 'Error', message: 'Please enter a response', color: 'red' });
      return;
    }
    
    if (addTicketResponse && selectedTicket) {
      addTicketResponse(selectedTicket.ticketId, responseMessage);
      notifications.show({
        title: 'Response Sent',
        message: `Your response has been sent to the field worker`,
        color: 'green'
      });
    }
    
    setResponseModalOpen(false);
    setResponseMessage('');
    setSelectedTicket(null);
  };

  return (
    <Container fluid>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Ticket Management</Title>
          <Text c="dimmed" size="sm">Manage and respond to field worker tickets</Text>
        </div>
        <Badge size="lg" color="teal" variant="light">
          Total: {filteredTickets.length} tickets
        </Badge>
      </Group>

      {/* Filters */}
      <Paper shadow="sm" radius="lg" p="md" mb="xl" withBorder>
        <Grid>
          <Grid.Col span={5}>
            <TextInput
              placeholder="Search by ID, title, region..."
              leftSection={<IconSearch size={16} />}
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              placeholder="Filter by Status"
              data={[
                { value: 'all', label: 'All Status' },
                { value: 'Open', label: 'Open' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Resolved', label: 'Resolved' },
                { value: 'Closed', label: 'Closed' }
              ]}
              value={filters.status}
              onChange={(val) => setFilters({...filters, status: val})}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              placeholder="Filter by Priority"
              data={[
                { value: 'all', label: 'All Priority' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
              ]}
              value={filters.priority}
              onChange={(val) => setFilters({...filters, priority: val})}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Button 
              fullWidth 
              variant="outline" 
              onClick={() => setFilters({ searchTerm: '', status: 'all', priority: 'all' })}
              leftSection={<IconRefresh size={16} />}
            >
              Reset
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Tickets Table */}
      <Card shadow="sm" radius="lg" withBorder p="xl">
        <ScrollArea h={550}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ticket ID</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Worker</Table.Th>
                <Table.Th>Region</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedTickets.map((ticket) => (
                <Table.Tr key={ticket.ticketId}>
                  <Table.Td>
                    <Badge variant="light" size="sm">{ticket.ticketId}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500} lineClamp={1}>{ticket.title}</Text>
                  </Table.Td>
                  <Table.Td>{ticket.workerName}</Table.Td>
                  <Table.Td>{ticket.region || 'N/A'}</Table.Td>
                  <Table.Td>
                    <Badge color={getPriorityColor(ticket.priority)} size="sm">
                      {ticket.priority}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs">{dayjs(ticket.createdAt).format('MMM DD, YYYY')}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(ticket.status)} size="sm">
                      {ticket.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Menu position="bottom-end" shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>Ticket Actions</Menu.Label>
                        <Menu.Item 
                          leftSection={<IconEye size={14} />}
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setResponseModalOpen(true);
                          }}
                          color="blue"
                        >
                          View & Respond
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Update Status</Menu.Label>
                        <Menu.Item 
                          leftSection={<IconClock size={14} />}
                          onClick={() => handleStatusUpdate(ticket.ticketId, 'In Progress')}
                          color="yellow"
                        >
                          In Progress
                        </Menu.Item>
                        <Menu.Item 
                          leftSection={<IconCheck size={14} />}
                          onClick={() => handleStatusUpdate(ticket.ticketId, 'Resolved')}
                          color="green"
                        >
                          Resolved
                        </Menu.Item>
                        <Menu.Item 
                          leftSection={<IconX size={14} />}
                          onClick={() => handleStatusUpdate(ticket.ticketId, 'Closed')}
                          color="gray"
                        >
                          Close
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        
        {totalPages > 1 && (
          <Group justify="center" mt="xl">
            <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} color="teal" />
          </Group>
        )}
      </Card>

      {/* Response Modal */}
      <Modal
        opened={responseModalOpen}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedTicket(null);
          setResponseMessage('');
        }}
        title={`Ticket: ${selectedTicket?.ticketId}`}
        size="lg"
      >
        {selectedTicket && (
          <Stack>
            <Paper withBorder p="md" radius="md" bg="gray.0">
              <Text fw={600} size="sm">Issue Details:</Text>
              <Text size="sm" mt="xs">{selectedTicket.description}</Text>
              <Group mt="md">
                <Badge color={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority} Priority</Badge>
                <Badge color={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
              </Group>
              <Text size="xs" c="dimmed" mt="xs">From: {selectedTicket.workerName}</Text>
            </Paper>
            
            <Textarea
              label="Your Response"
              placeholder="Type your response to the field worker..."
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              minRows={4}
              description="This message will be sent to the field worker"
            />
            
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setResponseModalOpen(false)}>Cancel</Button>
              <Button color="teal" onClick={handleSendResponse} leftSection={<IconMessage size={16} />}>
                Send Response
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default TicketsManagement;