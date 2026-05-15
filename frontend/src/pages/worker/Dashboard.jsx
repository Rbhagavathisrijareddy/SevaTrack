import WorkerLayout from "../../layouts/WorkerLayout";

import {
  Card,
  Stack,
  Title,
  Text,
} from "@mantine/core";

function Dashboard() {
  return (
    <WorkerLayout>

      <Title mb="md">
        Worker Dashboard
      </Title>

      <Stack>

        <Card>
          <Text>
            Today's
            submissions
          </Text>

          <Title order={2}>
            12
          </Title>
        </Card>

        <Card>
          <Text>
            Assigned Region
          </Text>

          <Title order={4}>
            Bangalore Rural
          </Title>
        </Card>

      </Stack>

    </WorkerLayout>
  );
}

export default Dashboard;