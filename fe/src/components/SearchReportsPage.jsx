import React, { useState } from 'react';
import { 
  Container, Title, Paper, Grid, Select, Button, Table, Badge, 
  Pagination, Group, Text, TextInput, Card, Stack,
  ActionIcon, Tooltip, ScrollArea, Menu 
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';  // ← This comes from @mantine/dates
import { IconSearch, IconRefresh, IconDownload, IconDots, IconCheck, IconX, IconEye } from '@tabler/icons-react';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';

const SearchReportsPage = () => {
  const { data, searchReports, updateReportStatus } = useData(); // Make sure updateReportStatus is imported
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
  const itemsPerPage = 15;

  const handleSearch = () => {
    const searchResults = searchReports(filters);
    setResults(searchResults);
    setCurrentPage(1);
    
    showNotification({
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
    
    showNotification({
      title: 'Filters Reset',
      message: 'All search filters have been cleared',
      color: 'blue'
    });
  };

  const handleStatusUpdate = (submissionId, newStatus) => {
    updateReportStatus(submissionId, newStatus);
    
    // Update local results to reflect the change immediately
    setResults(prevResults => 
      prevResults.map(report => 
        report.submissionId === submissionId 
          ? { ...report, status: newStatus }
          : report
      )
    );
    
    showNotification({
      title: 'Status Updated',
      message: `Report ${submissionId} marked as ${newStatus}`,
      color: 'green'
    });
  };

  const paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

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

  const exportToCSV = () => {
    if (results.length === 0) {
      showNotification({
        title: 'No Data',
        message: 'No reports to export',
        color: 'red'
      });
      return;
    }
    
    const headers = ['Submission ID', 'Worker Name', 'Worker ID', 'Region', 'Relief Type', 'Quantity', 'Beneficiary Count', 'Notes', 'Timestamp', 'Status', 'Disaster Type'];
    const csvData = results.map(r => [
      r.submissionId,
      r.workerName,
      r.workerId,
      r.region,
      r.reliefType,
      r.quantity,
      r.beneficiaryCount,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      dayjs(r.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      r.status,
      r.disasterType
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sevatrack_reports_${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification({
      title: 'Export Successful',
      message: `${results.length} reports exported to CSV`,
      color: 'green'
    });
  };

  return (
    <Container fluid>
      <Title order={2} mb="lg">Advanced Report Search</Title>
      
      {/* Search Filters */}
      <Paper shadow="sm" radius="lg" p="xl" mb="xl" withBorder>
        <Grid>
          <Grid.Col span={12}>
            <TextInput 
              label="Keyword Search" 
              placeholder="Search by ID, worker, region, disaster, keywords..." 
              value={filters.searchTerm} 
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})} 
              leftSection={<IconSearch size={16} />} 
              description="Search across submission IDs, worker names, regions, notes, and more"
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
              placeholder="Select region"
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
              placeholder="Select relief type"
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
              placeholder="Select worker"
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
              placeholder="Select disaster"
              data={[{value:'all', label:'All Disasters'}, ...data.disasterTypes.map(d => ({value: d, label: d}))]} 
              value={filters.disasterType} 
              onChange={(val) => setFilters({...filters, disasterType: val})} 
              clearable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select 
              label="Submission Status" 
              placeholder="Select status"
              data={[{value:'all', label:'All Status'}, ...data.statuses.map(s => ({value: s, label: s}))]} 
              value={filters.status} 
              onChange={(val) => setFilters({...filters, status: val})} 
              clearable
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group justify="flex-end" mt="md">
              <Button variant="outline" leftIcon={<IconRefresh size={16} />} onClick={handleReset}>
                Reset Filters
              </Button>
              <Button leftIcon={<IconSearch size={16} />} onClick={handleSearch} color="teal">
                Search Reports
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Results Table */}
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
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Worker</th>
                  <th>Worker ID</th>
                  <th>Region</th>
                  <th>Relief Type</th>
                  <th>Quantity</th>
                  <th>Beneficiaries</th>
                  <th>Notes</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.map((report) => (
                  <tr key={report.submissionId}>
                    <td>
                      <Badge variant="light" size="sm">{report.submissionId}</Badge>
                    </td>
                    <td>
                      <Text size="sm" fw={500}>{report.workerName}</Text>
                    </td>
                    <td>
                      <Text size="xs" c="dimmed">{report.workerId}</Text>
                    </td>
                    <td>
                      <Text size="sm">{report.region}</Text>
                    </td>
                    <td>
                      <Badge variant="outline" size="sm">{report.reliefType}</Badge>
                    </td>
                    <td>
                      <Text size="sm">{report.quantity}</Text>
                    </td>
                    <td>
                      <Text size="sm">{report.beneficiaryCount}</Text>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      <Text size="xs" lineClamp={2}>{report.notes}</Text>
                    </td>
                    <td>
                      <Text size="xs">{dayjs(report.timestamp).format('MMM DD, YYYY')}</Text>
                    </td>
                    <td>
                      <Badge color={getStatusColor(report.status)} size="sm">
                        {report.status}
                      </Badge>
                    </td>
                    <td>
                      <Menu position="bottom-end" shadow="md" width={150}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Update Status</Menu.Label>
                          <Menu.Item 
                            icon={<IconCheck size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Approved')}
                            color="green"
                          >
                            Approve
                          </Menu.Item>
                          <Menu.Item 
                            icon={<IconEye size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Verified')}
                            color="blue"
                          >
                            Verify
                          </Menu.Item>
                          <Menu.Item 
                            icon={<IconCheck size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Delivered')}
                            color="teal"
                          >
                            Mark Delivered
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item 
                            icon={<IconX size={14} />}
                            onClick={() => handleStatusUpdate(report.submissionId, 'Rejected')}
                            color="red"
                          >
                            Reject
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
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
          <Stack align="center" spacing="xs">
            <IconSearch size={48} stroke={1} color="#adb5bd" />
            <Text size="lg" fw={500} ta="center">No Reports Found</Text>
            <Text size="sm" c="dimmed" ta="center">
              {filters.searchTerm || filters.region !== 'all' || filters.status !== 'all' 
                ? 'Try adjusting your search filters or resetting them'
                : 'Use the search filters above to find reports'}
            </Text>
            {(filters.searchTerm || filters.region !== 'all' || filters.status !== 'all') && (
              <Button variant="light" onClick={handleReset} mt="md" size="sm">
                Reset All Filters
              </Button>
            )}
          </Stack>
        </Card>
      )}
    </Container>
  );
};

export default SearchReportsPage;