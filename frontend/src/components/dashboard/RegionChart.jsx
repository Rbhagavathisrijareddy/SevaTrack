import {
  Card,
  Title,
} from "@mantine/core";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  {
    region: "North",
    count: 45,
  },
  {
    region: "South",
    count: 30,
  },
  {
    region: "East",
    count: 20,
  },
  {
    region: "West",
    count: 50,
  },
];

function RegionChart() {
  return (
    <Card>

      <Title
        order={4}
        mb="md"
      >
        Region Engagement
      </Title>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart
          data={data}
        >
          <XAxis
            dataKey="region"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
          />
        </BarChart>
      </ResponsiveContainer>

    </Card>
  );
}

export default RegionChart;