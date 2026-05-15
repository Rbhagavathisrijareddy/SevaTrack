import WorkerLayout from "../../layouts/WorkerLayout";

import {
  Title,
  Card,
  Stack,
  Text,
  Badge,
} from "@mantine/core";

const submissions = [
  {
    village: "Village A",
    activity: "Farmer Training",
    status: "Submitted",
  },
  {
    village: "Village B",
    activity: "Medical Camp",
    status: "Pending",
  },
];

function History() {
  return (
    <WorkerLayout>

      <Title mb="md">
        Submission History
      </Title>

      <Stack>

        {submissions.map(
          (
            item,
            index
          ) => (
            <Card
              key={index}
            >
              <Text fw={600}>
                {item.activity}
              </Text>

              <Text size="sm">
                {item.village}
              </Text>

              <Badge mt="sm">
                {item.status}
              </Badge>
            </Card>
          )
        )}

      </Stack>

    </WorkerLayout>
  );
}

export default History;