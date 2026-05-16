import React, { useState, useEffect } from 'react';
import { Paper, TextInput, Select, NumberInput, Textarea, Button, Group, Grid, Title, Alert, Stack } from '@mantine/core';
import { IconUpload, IconCheck } from '@tabler/icons-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WorkerTickets from '../components/WorkerTickets';

const WorkerReportForm = () => {
  const { data, submitReport } = useData();
  const { user, token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reportId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(!!reportId);
  const [loading, setLoading] = useState(!!reportId);
  const [formData, setFormData] = useState({
    workerName: user?.name || '',
    workerId: user?.workerId || '',
    region: '',
    reliefType: '',
    disasterType: '',
    quantity: 0,
    beneficiaryCount: 0,
    notes: ''
  });

  // Load report data if editing
  useEffect(() => {
    if (reportId && token) {
      fetchReport();
    }
  }, [reportId, token]);

  const fetchReport = async () => {
    try {
      const apiBaseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : '';
      const response = await fetch(`${apiBaseUrl}/api/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch report');

      const result = await response.json();
      const report = result.data;

      setFormData({
        workerName: report.workerName,
        workerId: report.workerId,
        region: report.region,
        reliefType: report.reliefType,
        disasterType: report.disasterType,
        quantity: report.quantity || 0,
        beneficiaryCount: report.beneficiaryCount || 0,
        notes: report.notes || ''
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load report',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.region || !formData.reliefType || !formData.disasterType) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill all required fields',
        color: 'red'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      if (isEditMode && reportId) {
        // Update existing report
        const apiBaseUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3000' 
          : '';
        const response = await fetch(`${apiBaseUrl}/api/reports/${reportId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            region: formData.region,
            reliefType: formData.reliefType,
            disasterType: formData.disasterType,
            quantity: formData.quantity,
            beneficiaryCount: formData.beneficiaryCount,
            notes: formData.notes,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update report');
        }

        notifications.show({
          title: 'Success!',
          message: 'Your report has been updated',
          color: 'green',
          icon: <IconCheck size={16} />
        });

        // Navigate back to submissions after update
        setTimeout(() => {
          navigate('/worker?tab=history');
        }, 1000);
      } else {
        // Create new report
        const newReport = {
          ...formData,
          workerName: user?.name || formData.workerName,
          workerId: user?.workerId || formData.workerId,
        };
        
        submitReport(newReport);
        
        notifications.show({
          title: 'Success!',
          message: 'Your report has been submitted to NGO',
          color: 'green',
          icon: <IconCheck size={16} />
        });
        
        // Reset form
        setFormData({
          workerName: user?.name || '',
          workerId: user?.workerId || '',
          region: '',
          reliefType: '',
          disasterType: '',
          quantity: 0,
          beneficiaryCount: 0,
          notes: ''
        });
      }
      
    } catch (error) {
      console.error('Error submitting report:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to submit report',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Paper shadow="sm" radius="lg" p="xl" withBorder>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading report...</p>
        </div>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" radius="lg" p="xl" withBorder>
      <Title order={3} mb="md">{isEditMode ? 'Edit Report' : 'Submit Field Report'}</Title>
      {isEditMode && (
        <Alert mb="md" color="blue" title="Edit Mode">
          You are editing this report. Only reports with "Pending Review" status can be edited.
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Worker Name"
              value={formData.workerName}
              disabled
              description="Auto-filled from your profile"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Worker ID"
              value={formData.workerId}
              disabled
              description="Auto-filled from your profile"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Region *"
              placeholder="Select affected region"
              data={data.regions.map(r => ({ value: r, label: r }))}
              value={formData.region}
              onChange={(val) => setFormData({ ...formData, region: val })}
              required
              searchable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Disaster Type *"
              placeholder="Select disaster type"
              data={data.disasterTypes.map(d => ({ value: d, label: d }))}
              value={formData.disasterType}
              onChange={(val) => setFormData({ ...formData, disasterType: val })}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Relief Type *"
              placeholder="Select relief type"
              data={data.reliefTypes.map(r => ({ value: r, label: r }))}
              value={formData.reliefType}
              onChange={(val) => setFormData({ ...formData, reliefType: val })}
              required
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Quantity Distributed"
              placeholder="Number of units"
              value={formData.quantity}
              onChange={(val) => setFormData({ ...formData, quantity: val || 0 })}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Beneficiary Count"
              placeholder="Number of people helped"
              value={formData.beneficiaryCount}
              onChange={(val) => setFormData({ ...formData, beneficiaryCount: val || 0 })}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Additional Notes"
              placeholder="Describe the situation, urgent needs, observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              minRows={4}
              maxRows={6}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group justify="flex-end" mt="md">
              <Button 
                type="submit" 
                color="teal" 
                leftSection={<IconUpload size={16} />}
                loading={submitting}
                size="md"
              >
                Submit Report to NGO
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
      
      <Alert mt="xl" color="blue" variant="light">
        <div>
          <strong>Important:</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Your report will be sent to the NGO dashboard for review. The NGO team will review and approve your submission.</p>
        </div>
      </Alert>
    </Paper>
  );
};

export default WorkerReportForm;