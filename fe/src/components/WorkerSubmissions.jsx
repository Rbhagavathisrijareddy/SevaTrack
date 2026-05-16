import React, { useState } from 'react';
import { 
  Table, Badge, Paper, Text, ScrollArea, Group, Title, Stack, 
  Card, Divider, ThemeIcon, Button, Modal, Textarea, Alert 
} from '@mantine/core';
import { 
  IconMessage, IconEye, IconCheck, IconClock, IconAlertCircle, 
  IconSend, IconThumbUp 
} from '@tabler/icons-react';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';
import StatusBadge from './StatusBadge';

const WorkerSubmissions = ({ workerId }) => {
  const { data, updateReportStatus, addWorkerAcknowledgment } = useData();
  const [expandedRow, setExpandedRow] = useState(null);
  const [acknowledgeModalOpen, setAcknowledgeModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [acknowledgmentMessage, setAcknowledgmentMessage] = useState('');
  
  const workerReports = data.reports.filter(r => r.workerId === workerId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const getStatusColor = (status) => {
    const colors = {
      'Pending Review': 'yellow',
      'Approved': 'green',
      'Delivered': 'blue',
      'Verified': 'teal',
      'Rejected': 'red',
      'Acknowledged': 'grape'
    };
    return colors[status] || 'gray';
  };

  const handleAcknowledge = () => {
    if (!acknowledgmentMessage.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter an acknowledgment message',
        color: 'red'
      });
      return;
    }

    if (addWorkerAcknowledgment && selectedReport) {
      addWorkerAcknowledgment(selectedReport.submissionId, acknowledgmentMessage);
      
      notifications.show({
        title: 'Acknowledgment Sent',
        message: 'NGO has been notified of your response',
        color: 'green'
      });
    }
    
    setAcknowledgeModalOpen(false);
    setAcknowledgmentMessage('');
    setSelectedReport(null);
  };

  const canAcknowledge = (report) => {
    return report.status !== 'Pending Review' && 
           report.status !== 'Rejected' && 
           report.status !== 'Acknowledged' &&
           report.ngoResponse;
  };

  if (workerReports.length === 0) {
    return (
      <Paper shadow="sm" radius="lg" p="xl" withBorder>
        <Stack align="center" gap="xs">
          <IconMessage size={48} stroke={1} color="#adb5bd" />
          <Text ta="center" c="dimmed">No submissions found.</Text>
          <Text size="sm" c="dimmed">Submit your first report using the form above.</Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" radius="lg" p="xl" withBorder>
      <Group justify="space-between" mb="md">
        <div>
          <Title order={4}>My Submissions</Title>
          <Text size="xs" c="dimmed">Total: {workerReports.length} reports</Text>
        </div>
      </Group>
      
      <ScrollArea h={550}>
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
              <Table.Th>NGO Response</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {workerReports.map((report) => (
              <React.Fragment key={report.submissionId}>
                <Table.Tr style={{ cursor: 'pointer' }} onClick={() => setExpandedRow(expandedRow === report.submissionId ? null : report.submissionId)}>
                  <Table.Td>
                    <Badge variant="light" size="sm">{report.submissionId}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{report.region}</Text>
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
                    <Text size="xs">{dayjs(report.timestamp).format('MMM DD, YYYY')}</Text>
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge status={report.status} size="sm" variant="light" />
                  </Table.Td>
                  <Table.Td>
                    {report.ngoResponse ? (
                      <Group gap="xs">
                        <ThemeIcon color={report.viewedByNGO ? 'teal' : 'gray'} size="sm" radius="xl" variant="light">
                          <IconMessage size={12} />
                        </ThemeIcon>
                        <Text size="xs" c={report.viewedByNGO ? 'teal' : 'dimmed'}>
                          {report.viewedByNGO ? 'Responded' : 'Awaiting response'}
                        </Text>
                      </Group>
                    ) : (
                      <Text size="xs" c="dimmed">No response yet</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {canAcknowledge(report) && (
                      <Button 
                        size="xs" 
                        variant="light" 
                        color="teal"
                        leftSection={<IconThumbUp size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                          setAcknowledgeModalOpen(true);
                        }}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {report.status === 'Acknowledged' && (
                      <Badge color="grape" size="sm" leftSection={<IconCheck size={12} />}>
                        Acknowledged
                      </Badge>
                    )}
                  </Table.Td>
                </Table.Tr>
                
                {/* Expanded row showing NGO response */}
                {expandedRow === report.submissionId && (
                  <Table.Tr>
                    <Table.Td colSpan={9} style={{ backgroundColor: '#f8f9fa' }}>
                      <Card shadow="none" withBorder p="md" radius="md">
                        <Group mb="xs" justify="space-between">
                          <Group>
                            <ThemeIcon color="teal" size="md" radius="xl">
                              <IconMessage size={16} />
                            </ThemeIcon>
                            <Text fw={600} size="sm">NGO Response</Text>
                            {report.viewedByNGO && (
                              <Badge color="teal" size="xs" leftSection={<IconEye size={10} />}>
                                Viewed by NGO
                              </Badge>
                            )}
                          </Group>
                          {report.ngoResponseDate && (
                            <Text size="xs" c="dimmed">
                              {dayjs(report.ngoResponseDate).format('MMM DD, YYYY hh:mm A')}
                            </Text>
                          )}
                        </Group>
                        
                        <Divider mb="md" />
                        
                        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                          {report.ngoResponse || 'No response yet. NGO will review your report soon.'}
                        </Text>
                        
                        {/* Worker Acknowledgment Section */}
                        {report.workerAcknowledgment && (
                          <>
                            <Divider my="md" label="Your Acknowledgment" labelPosition="center" />
                            <Card withBorder p="sm" radius="md" bg="grape.0" mt="md">
                              <Group mb="xs">
                                <ThemeIcon color="grape" size="sm" radius="xl">
                                  <IconThumbUp size={12} />
                                </ThemeIcon>
                                <Text fw={600} size="sm" c="grape">You acknowledged:</Text>
                                {report.acknowledgmentDate && (
                                  <Text size="xs" c="dimmed">
                                    {dayjs(report.acknowledgmentDate).format('MMM DD, YYYY hh:mm A')}
                                  </Text>
                                )}
                              </Group>
                              <Text size="sm">{report.workerAcknowledgment}</Text>
                            </Card>
                          </>
                        )}
                        
                        {report.status === 'Pending Review' && (
                          <Group mt="md" gap="xs">
                            <IconClock size={14} color="#f59e0b" />
                            <Text size="xs" c="dimmed">
                              Your report is being reviewed by the NGO team. You will receive a response soon.
                            </Text>
                          </Group>
                        )}
                        
                        {report.status === 'Approved' && !report.workerAcknowledgment && (
                          <Group mt="md" gap="xs">
                            <IconCheck size={14} color="#10b981" />
                            <Text size="xs" c="green">
                              Great news! Your report has been approved. Please acknowledge to confirm you've received this update.
                            </Text>
                          </Group>
                        )}
                        
                        {report.status === 'Rejected' && (
                          <Group mt="md" gap="xs">
                            <IconAlertCircle size={14} color="#ef4444" />
                            <Text size="xs" c="red">
                              If you believe this is an error, please contact your supervisor or submit a new report with additional details.
                            </Text>
                          </Group>
                        )}
                        
                        <Divider mt="md" mb="md" />
                        
                        <Group justify="space-between">
                          <div>
                            <Text size="xs" fw={500}>Original Report Notes:</Text>
                            <Text size="xs" c="dimmed">{report.notes}</Text>
                          </div>
                          <StatusBadge status={report.status} size="sm" />
                        </Group>
                      </Card>
                    </Table.Td>
                  </Table.Tr>
                )}
              </React.Fragment>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      
      {/* Summary Stats */}
      <Divider my="md" />
      <Group justify="space-between">
        <div>
          <Text size="xs" c="dimmed">Recent Activity</Text>
          <Text size="xs">
            Last report: {workerReports.length > 0 ? dayjs(workerReports[0].timestamp).format('MMM DD, YYYY') : 'N/A'}
          </Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">Response Rate</Text>
          <Text size="xs">
            {workerReports.filter(r => r.ngoResponse).length} / {workerReports.length} received responses
          </Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">Acknowledgment Rate</Text>
          <Text size="xs">
            {workerReports.filter(r => r.workerAcknowledgment).length} / {workerReports.filter(r => r.ngoResponse).length} acknowledged
          </Text>
        </div>
      </Group>

      {/* Acknowledgment Modal */}
      <Modal
        opened={acknowledgeModalOpen}
        onClose={() => {
          setAcknowledgeModalOpen(false);
          setSelectedReport(null);
          setAcknowledgmentMessage('');
        }}
        title="Acknowledge NGO Response"
        size="lg"
      >
        {selectedReport && (
          <Stack>
            <Card withBorder p="md" radius="md" bg="teal.0">
              <Text fw={600} size="sm" c="teal">NGO's Response:</Text>
              <Text size="sm" mt="xs">{selectedReport.ngoResponse}</Text>
              <Text size="xs" c="dimmed" mt="xs">
                Status: <StatusBadge status={selectedReport.status} size="xs" />
              </Text>
            </Card>
            
            <Textarea
              label="Your Acknowledgment Message"
              placeholder="Type your response to the NGO (e.g., Thank you, we have received the supplies, etc.)..."
              value={acknowledgmentMessage}
              onChange={(e) => setAcknowledgmentMessage(e.target.value)}
              minRows={3}
              description="Let the NGO know you've received and understood their response"
              required
            />
            
            <Alert color="blue" variant="light">
              <Text size="xs">By acknowledging, you confirm that you have received and understood the NGO's response. This helps track communication effectiveness.</Text>
            </Alert>
            
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setAcknowledgeModalOpen(false)}>Cancel</Button>
              <Button color="teal" onClick={handleAcknowledge} leftSection={<IconSend size={16} />}>
                Send Acknowledgment
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Paper>
  );
};

export default WorkerSubmissions;