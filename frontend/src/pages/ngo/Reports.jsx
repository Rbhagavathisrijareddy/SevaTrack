import NgoLayout from "../../layouts/NgoLayout";

import {
  Title,
  Card,
  Text,
} from "@mantine/core";

function Reports() {
  return (
    <NgoLayout>

      <Title mb="md">
        Reports
      </Title>

      <Card>

        <Title order={4}>
          Weekly Summary
        </Title>

        <Text mt="md">
          120 farmers trained
          across 8 villages.
        </Text>

        <Text mt="sm">
          Water shortage
          reported in
          northern villages.
        </Text>

      </Card>

    </NgoLayout>
  );
}

export default Reports;