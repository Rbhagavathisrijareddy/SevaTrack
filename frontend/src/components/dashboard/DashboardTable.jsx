    import {
  Table,
} from "@mantine/core";

function DashboardTable({
  data,
}) {
  const rows =
    data.map(
      (
        item,
        index
      ) => (
        <Table.Tr
          key={index}
        >
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
      )
    );

  return (
    <Table
      striped
      highlightOnHover
    >
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
  );
}

export default DashboardTable;