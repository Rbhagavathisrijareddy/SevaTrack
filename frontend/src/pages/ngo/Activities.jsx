import NgoLayout from "../../layouts/NgoLayout";

import {
  Title,
  TextInput,
  Table,
  Card,
} from "@mantine/core";

const activities = [
  {
    worker: "Rahul",
    village: "Village A",
    count: 40,
    issue: "Water shortage",
  },
  {
    worker: "Priya",
    village: "Village B",
    count: 20,
    issue: "Low attendance",
  },
];

function Activities() {
  const rows =
    activities.map((item, i) => (
      <Table.Tr key={i}>

        <Table.Td>
          {item.worker}
        </Table.Td>

        <Table.Td>
          {item.village}
        </Table.Td>

        <Table.Td>
          {item.count}
        </Table.Td>

        <Table.Td>
          {item.issue}
        </Table.Td>

      </Table.Tr>
    ));

  return (
    <NgoLayout>

      <Title mb="md">
        Activities
      </Title>

      <TextInput
        mb="md"
        placeholder="Search village..."
      />

      <Card>

        <Table>

          <Table.Thead>
            <Table.Tr>

              <Table.Th>
                Worker
              </Table.Th>

              <Table.Th>
                Village
              </Table.Th>

              <Table.Th>
                Count
              </Table.Th>

              <Table.Th>
                Issue
              </Table.Th>

            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {rows}
          </Table.Tbody>

        </Table>

      </Card>

    </NgoLayout>
  );
}

export default Activities;