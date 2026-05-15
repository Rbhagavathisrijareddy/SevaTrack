import NgoLayout from "../../layouts/NgoLayout";

import {
  Title,
  Table,
  Badge,
  Card,
} from "@mantine/core";

const workers = [
  {
    name: "Rahul",
    region: "North",
    status: "Active",
  },
  {
    name: "Priya",
    region: "South",
    status: "Inactive",
  },
];

function Workers() {
  const rows =
    workers.map((worker) => (
      <Table.Tr key={worker.name}>
        <Table.Td>
          {worker.name}
        </Table.Td>

        <Table.Td>
          {worker.region}
        </Table.Td>

        <Table.Td>
          <Badge>
            {worker.status}
          </Badge>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <NgoLayout>

      <Title mb="md">
        Workers
      </Title>

      <Card>

        <Table>

          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                Name
              </Table.Th>

              <Table.Th>
                Region
              </Table.Th>

              <Table.Th>
                Status
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

export default Workers;