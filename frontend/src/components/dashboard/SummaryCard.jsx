import {
  Card,
  Title,
  Text,
} from "@mantine/core";

function SummaryCard() {
  return (
    <Card>

      <Title order={4}>
        Weekly AI Summary
      </Title>

      <Text mt="md">
        This week,
        120 farmers
        were trained
        across
        8 villages.
      </Text>

      <Text mt="sm">
        Major issue:
        Water shortage.
      </Text>

      <Text mt="sm">
        Region West
        had low
        engagement.
      </Text>

    </Card>
  );
}

export default SummaryCard;