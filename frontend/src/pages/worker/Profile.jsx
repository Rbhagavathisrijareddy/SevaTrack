import WorkerLayout from "../../layouts/WorkerLayout";

import {
  Title,
  Card,
  Text,
  Stack,
  Button,
} from "@mantine/core";

function Profile() {
  return (
    <WorkerLayout>

      <Title mb="md">
        Profile
      </Title>

      <Card>

        <Stack>

          <div>
            <Text fw={600}>
              Name
            </Text>

            <Text>
              Rahul Kumar
            </Text>
          </div>

          <div>
            <Text fw={600}>
              Region
            </Text>

            <Text>
              Bangalore Rural
            </Text>
          </div>

          <div>
            <Text fw={600}>
              Phone
            </Text>

            <Text>
              +91 9876543210
            </Text>
          </div>

          <Button color="red">
            Logout
          </Button>

        </Stack>

      </Card>

    </WorkerLayout>
  );
}

export default Profile;