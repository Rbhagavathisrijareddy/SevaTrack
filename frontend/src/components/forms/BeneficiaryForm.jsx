import {
  Card,
  Stack,
  Select,
  NumberInput,
} from "@mantine/core";

import CustomInput
from "./CustomInput";

function BeneficiaryForm() {
  return (
    <Card shadow="sm">

      <Stack>

        <CustomInput
          label="Beneficiary Name"
          placeholder="Enter name"
        />

        <NumberInput
          label="Age"
          placeholder="Enter age"
        />

        <Select
          label="Gender"
          placeholder="Select gender"
          data={[
            "Male",
            "Female",
            "Other",
          ]}
        />

        <CustomInput
          label="Phone Number"
          placeholder="Enter phone"
        />

        <CustomInput
          label="Village"
          placeholder="Village name"
        />

        <Select
          label="Region"
          placeholder="Select region"
          data={[
            "North",
            "South",
            "East",
            "West",
          ]}
        />

      </Stack>

    </Card>
  );
}

export default BeneficiaryForm;