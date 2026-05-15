import React, { useState } from 'react';
import { TextInput, Modal, Table, Badge, Group, Text, ScrollArea, Paper, Divider } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useData } from '../contexts/DataContext';

const GlobalSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ reports: [], tickets: [] });
  const [opened, setOpened] = useState(false);
  const { globalSearch } = useData();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const searchResults = globalSearch(query);
      setResults(searchResults);
      setOpened(true);
    } else {
      setOpened(false);
    }
  };

  return (
    <>
      <TextInput
        placeholder="Search reports, workers, activities, regions..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 300 }}
        radius="xl"
      />
      <Modal opened={opened} onClose={() => setOpened(false)} title="Global Search Results" size="xl" scrollAreaComponent={ScrollArea.Autosize}>
        {searchQuery && (
          <>
            <Text size="sm" c="dimmed" mb="md">Showing results for: "{searchQuery}"</Text>
            <Divider label="Reports" labelPosition="left" mb="md" />
            {results.reports.length > 0 ? (
              <ScrollArea h={300}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ID</Table.Th>
                      <Table.Th>Worker</Table.Th>
                      <Table.Th>Region</Table.Th>
                      <Table.Th>Disaster</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {results.reports.slice(0, 10).map((r) => (
                      <Table.Tr key={r.submissionId}>
                        <Table.Td><Badge variant="light">{r.submissionId}</Badge></Table.Td>
                        <Table.Td>{r.workerName}</Table.Td>
                        <Table.Td>{r.region}</Table.Td>
                        <Table.Td>{r.disasterType}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            ) : <Text c="dimmed">No reports found</Text>}
            
            <Divider label="Tickets" labelPosition="left" my="md" />
            {results.tickets.length > 0 ? (
              <ScrollArea h={200}>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr><Table.Th>Ticket ID</Table.Th><Table.Th>Title</Table.Th><Table.Th>Status</Table.Th></Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {results.tickets.slice(0, 5).map((t) => (
                      <Table.Tr key={t.ticketId}><Table.Td>{t.ticketId}</Table.Td><Table.Td>{t.title}</Table.Td><Table.Td><Badge>{t.status}</Badge></Table.Td></Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            ) : <Text c="dimmed">No tickets found</Text>}
          </>
        )}
      </Modal>
    </>
  );
};

export default GlobalSearchBar;