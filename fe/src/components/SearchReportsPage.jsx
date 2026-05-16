import React, { useState } from 'react';
import { 
  Container, Title, Paper, Grid, Select, Button, Table, Badge, 
  Pagination, Group, Text, TextInput, Card, 
  ActionIcon, Tooltip, ScrollArea, Menu, Modal, Textarea, Stack 
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { 
  IconSearch, IconRefresh, IconDownload, IconDots, 
  IconCheck, IconX, IconEye, IconMessage, IconEyeOff, IconThumbUp 
} from '@tabler/icons-react';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';
import StatusBadge from './StatusBadge';

const SearchReportsPage = () => {
  const { data, searchReports, updateReportStatus, markReportAsViewed, addCustomResponse } = useData();
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateRange: [null, null],
    region: 'all',
    reliefType: 'all',
    workerName: 'all',
    disasterType: 'all',
    status: 'all',
    ticketStatus: 'all',
  });
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [customResponse, setCustomResponse] = useState('');
  const itemsPerPage = 15;

  const handleSearch = () => {
    const searchResults = searchReports(filters);
    setResults(searchResults);
    setCurrentPage(1);
    
    notifications.show({
      title: 'Search Complete',
      message: `Found ${searchResults.length} reports`,
      color: 'teal',
      autoClose: 2000
    });
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      dateRange: [null, null],
      region: 'all',
      reliefType: 'all',
      workerName: 'all',
      disasterType: 'all',
      status: 'all',
      ticketStatus: 'all',
    });
    setResults([]);
    
    notifications.show({
      title: 'Filters Reset',
      message: 'All search filters have been cleared',
      color: 'blue'
    });
  };

  const handleStatusUpdate = (submissionId, newStatus) => {
    updateReportStatus(submissionId, newStatus);
    
    setResults(prevResults => 
      prevResults.map(report => 
        report.submissionId === submissionId 
          ? { ...report, status: newStatus }
          : report
      )
    );
    
    notifications.show({
      title: 'Status Updated',
      message: `Report ${submissionId} marked as ${newStatus}`,
      color: 'green'
    });
  };
  
  const handleMarkAsViewed = (submissionId) => {
    markReportAsViewed(submissionId);
    
    setResults(prevResults => 
      prevResults.map(report => 
        report.submissionId === submissionId 
          ? { ...report, viewedByNGO: true, viewedAt: new Date().toISOString() }
          : report
      )
    );
    
    notifications.show({
      title: 'Report Viewed',
      message: `Marked as viewed - worker will see this status`,
      color: 'blue'
    });
  };
  
  const handleCustomResponse = () => {
    if (!customResponse.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter a response message',
        color: 'red'
      });
      return;
    }
    
    addCustomResponse(selectedReport.submissionId, customResponse);
    
    setResults(prevResults => 
      prevResults.map(report => 
        report.submissionId === selectedReport.submissionId 
          ? { ...report, ngoResponse: customResponse, ngoResponseDate: new Date().toISOString() }
          : report
      )
    );
    
    notifications.show({
      title: 'Response Sent',
      message: `Your response has been sent to the field worker`,
      color: 'green'
    });
    
    setResponseModalOpen(false);
    setCustomResponse('');
    setSelectedReport(null);
  };

  const paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const exportToCSV = () => {
    if (results.length === 0) {
      notifications.show({
        title: 'No Data',
        message: 'No reports to export',
        color: 'red'
      });
      return;
    }
    
    const headers = ['Submission ID', 'Worker Name', 'Region', 'Disaster Type', 'Relief Type', 'Beneficiaries', 'Status', 'Viewed', 'Acknowledged', 'Submitted Date'];
    const csvData = results.map(r => [
      r.submissionId,
      r.workerName,
      r.region,
      r.disasterType,
      r.reliefType,
      r.beneficiaryCount,
      r.status,
      r.viewedByNGO ? 'Yes' : 'No',
      r.workerAcknowledgment ? 'Yes' : 'No',
      dayjs(r.timestamp).format('YYYY-MM-DD')
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sevatrack_reports_${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Export Successful',
      message: `${results.length} reports exported to CSV`,
      color: 'green'
    });
  };

  return (
    <Container fluid>
      <Title order={2} mb="lg">Advanced Report Search</Title>
      
      <Paper shadow="sm" radius="lg" p="xl" mb="xl" withBorder>
        <Grid>
          <Grid.Col span={12}>
            <TextInput 
              label="Keyword Search" 
              placeholder="Search by ID, worker, region, disaster, keywords, response..." 
              value={filters.searchTerm} 
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})} 
              leftSection={<IconSearch size={16} />} 
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePickerInput 
              type="range" 
              label="Date Range" 
              placeholder="Pick date range" 
              value={filters.dateRange} 
              onChange={(val) => setFilters({...filters, dateRange: val})} 
              clearable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select 
              label="Region" 
              data={[{value:'all', label:'All Regions'}, ...data.regions.map(r => ({value: r, label: r}))]} 
              value={filters.region} 
              onChange={(val) => setFilters({...filters, region: val})} 
              clearable
              searchable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select 
              label="Relief Type" 
              data={[{value:'all', label:'All Types'}, ...data.reliefTypes.map(r => ({value: r, label: r}))]} 
              value={filters.reliefType} 
              onChange={(val) => setFilters({...filters, reliefType: val})} 
              clearable
              searchable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select 
              label="Worker Name" 
              data={[{value:'all', label:'All Workers'}, ...data.workerNames.map(w => ({value: w, label: w}))]} 
              value={filters.workerName} 
              onChange={(val) => setFilters({...filters, workerName: val})} 
              clearable
              searchable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select 
              label="Disaster Type" 
              data={[{value:'all', label:'All Disasters'}, ...data.disasterTypes.map(d => ({value: d, label: d}))]} 
              value={filters.disasterType} 
              onChange={(val) => setFilters({...filters, disasterType: val})} 
              clearable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select 
              label="Submission Status" 
              data={[
                {value:'all', label:'All Status'}, 
                {value:'Pending Review', label:'Pending Review'},
                {value:'Approved', label:'Approved'},
                {value:'Delivered', label:'Delivered'},
                {value:'Verified', label:'Verified'},
                {value:'Rejected', label:'Rejected'},
                {value:'Acknowledged', label:'Acknowledged'}
              ]} 
              value={filters.status} 
              onChange={(val) => setFilters({...filters, status: val})} 
              clearable
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group justify="flex-end" mt="md">
              <Button variant="outline" leftSection={<IconRefresh size={16} />} onClick={handleReset}>
                Reset Filters
              </Button>
              <Button leftSection={<IconSearch size={16} />} onClick={handleSearch} color="teal">
                Search Reports
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      {results.length > 0 ? (
        <Card shadow="sm" radius="lg" withBorder p="xl">
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={600} size="lg">Search Results</Text>
              <Text size="sm" c="dimmed">Found {results.length} reports</Text>
            </div>
            <Tooltip label="Export to CSV">
              <ActionIcon variant="light" color="teal" size="lg" onClick={exportToCSV}>
                <IconDownload size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
          
          <ScrollArea h={550}>
            <Table striped highlightOnHover horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Submission ID</Table.Th>
                  <Table.Th>Worker</Table.Th>
                  <Table.Th>Region</Table.Th>
                  <Table.Th>Disaster</Table.Th>
                  <Table.Th>Relief Type</Table.Th>
                  <Table.Th>Beneficiaries</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Viewed</Table.Th>
                  <Table.Th>Acknowledged</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedResults.map((report) => (
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
                      <Text size="sm">{report.disasterType}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="outline" size="sm">{report.reliefType}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{report.beneficiaryCount}</Text>
                    </Table.Td>
                    <Table.Td>
                      <StatusBadge status={report.status} size="md" />
                    </Table.Td>
                    <Table.Td>
                      {report.viewedByNGO ? (
                        <Tooltip label={`Viewed on ${dayjs(report.viewedAt).format('MMM DD, YYYY')}`}>
                          <Badge color="green" size="sm" leftSection={<IconEye size={12} />}>Viewed</Badge>
                        </Tooltip>
                      ) : (
                        <Badge color="gray" size="sm" leftSection={<IconEyeOff size={12} />}>Not Viewed</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {report.workerAcknowledgment ? (
                        <Tooltip label={report.workerAcknowledgment}>
                          <Badge color="grape" size="sm" leftSection={<IconThumbUp size={12} />}>
                            Acknowledged
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Badge color="gray" size="sm">Pending</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end" shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Report Actions</Menu.Label>
                          {!report.viewedByNGO && (
                            <Menu.Item 
                              leftSection={<IconEye size={14} />}
                              onClick={() => handleMarkAsViewed(report.submissionId)}
                              color="blue"
                            >
                              Mark as Viewed
                            </Menu.Item>
                          )}
                          <Menu.Item 
                            leftSection={<IconMessage size={14} />}
                            onClick={() => {
                              setSelectedReport(report);
                              setCustomResponse(report.ngoResponse || '');
                              setResponseModalOpen(true);
                            }}
                            color="teal"
                          >
                            Send Response
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Label>Update Status</Menu.Label>
                          <Menu.Item 
                            leftSection={<IconCheck size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Approved')}
                            color="green"
                          >
                            Approve
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconEye size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Verified')}
                            color="blue"
                          >
                            Verify
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconCheck size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Delivered')}
                            color="teal"
                          >
                            Mark Delivered
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item 
                            leftSection={<IconX size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Rejected')}
                            color="red"
                          >
                            Reject
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
              <Pagination 
                total={totalPages} 
                value={currentPage} 
                onChange={setCurrentPage} 
                color="teal" 
                size="md"
              />
            </Group>
          )}
        </Card>
      ) : (
        <Card shadow="sm" radius="lg" withBorder p="xl">
          <Stack align="center" gap="xs">
            <IconSearch size={48} stroke={1} color="#adb5bd" />
            <Text size="lg" fw={500} ta="center">No Reports Found</Text>
            <Text size="sm" c="dimmed" ta="center">
              {filters.searchTerm || filters.region !== 'all' || filters.status !== 'all' 
                ? 'Try adjusting your search filters or resetting them'
                : 'Use the search filters above to find reports'}
            </Text>
          </Stack>
        </Card>
      )}
      
      {/* Custom Response Modal */}
      <Modal
        opened={responseModalOpen}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedReport(null);
          setCustomResponse('');
        }}
        title={`Send Response to ${selectedReport?.workerName || 'Worker'}`}
        size="lg"
      >
        <Stack>
          <Text size="sm" fw={500}>Report: {selectedReport?.submissionId}</Text>
          <Text size="xs" c="dimmed">Region: {selectedReport?.region} | Disaster: {selectedReport?.disasterType}</Text>
          <Textarea
            label="Response Message"
            placeholder="Type your response to the field worker..."
            value={customResponse}
            onChange={(e) => setCustomResponse(e.target.value)}
            minRows={4}
            maxRows={8}
            description="This message will be visible to the field worker in their submissions"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setResponseModalOpen(false)}>Cancel</Button>
            <Button color="teal" onClick={handleCustomResponse} leftSection={<IconMessage size={16} />}>
              Send Response
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default SearchReportsPage;