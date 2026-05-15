import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Container,
  Text,
} from "@mantine/core";

import {
  useNavigate,
} from "react-router-dom";

function Login() {
  const navigate =
    useNavigate();

  const handleLogin =
    (role) => {
      if (
        role === "worker"
      ) {
        navigate(
          "/worker/dashboard"
        );
      }

      if (role === "ngo") {
        navigate(
          "/ngo/dashboard"
        );
      }
    };

  return (
    <Container
      size={420}
      my={80}
    >
      <Paper
        radius="xl"
        shadow="sm"
        p="xl"
      >
        <Title ta="center">
          SevaTrack
        </Title>

        <Text
          ta="center"
          c="dimmed"
          mb="lg"
        >
          NGO Field Management
        </Text>

        <Stack>
          <TextInput
            label="Email"
            placeholder="Enter email"
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
          />

          <Button
            onClick={() =>
              handleLogin(
                "worker"
              )
            }
          >
            Login as Worker
          </Button>

          <Button
            variant="light"
            onClick={() =>
              handleLogin("ngo")
            }
          >
            Login as NGO
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Login;