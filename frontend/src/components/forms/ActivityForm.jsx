import {
  Card,
  Stack,
  Select,
  NumberInput,
  Textarea,
  Button,
} from "@mantine/core";

function ActivityForm() {
  return (
    <Card shadow="sm">

      <Stack>

        <Select
          label="Activity Type"
          placeholder="Choose activity"
          data={[
            "Farmer Training",
            "Medical Camp",
            "Education",
            "Awareness Program",
          ]}
        />

        <NumberInput
          label="Beneficiary Count"
          placeholder="Enter count"
        />

        <Textarea
          label="Issues Observed"
          placeholder="Water shortage, low attendance..."
        />

        <Textarea
          label="Additional Notes"
          placeholder="Extra details"
        />

        <Button fullWidth>
          Submit Activity
        </Button>

      </Stack>

    </Card>
  );
}

export default ActivityForm;