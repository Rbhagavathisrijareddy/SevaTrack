import WorkerLayout from "../../layouts/WorkerLayout";

import {
  Stack,
  Title,
} from "@mantine/core";

import BeneficiaryForm
from "../../components/forms/BeneficiaryForm";

import ActivityForm
from "../../components/forms/ActivityForm";

function SubmitData() {
  return (
    <WorkerLayout>

      <Title mb="md">
        Submit Activity
      </Title>

      <Stack>

        <BeneficiaryForm />

        <ActivityForm />

      </Stack>

    </WorkerLayout>
  );
}

export default SubmitData;