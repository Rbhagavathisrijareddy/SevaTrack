import {
  Card,
  Text,
  Title,
} from "@mantine/core";

function StatsCard({
  title,
  value,
}) {
  return (
    <Card shadow="sm">
      <Text
        c="dimmed"
        size="sm"
      >
        {title}
      </Text>

      <Title order={2}>
        {value}
      </Title>
    </Card>
  );
}

export default StatsCard;