import NgoLayout from "../../layouts/NgoLayout";

import {
  Grid,
  Title,
} from "@mantine/core";

import StatsCard from "../../components/dashboard/StatsCard";

import DashboardTable from "../../components/dashboard/DashboardTable";

import RegionChart from "../../components/dashboard/RegionChart";

import SummaryCard from "../../components/dashboard/SummaryCard";

const tableData = [
  {
    worker: "Rahul",
    village: "Village A",
    count: 40,
    issue: "Water shortage",
  },
  {
    worker: "Priya",
    village: "Village B",
    count: 20,
    issue: "Low attendance",
  },
];

function Dashboard() {
  return (
    <NgoLayout>

      <Title mb="lg">
        NGO Dashboard
      </Title>

      <Grid mb="lg">

        <Grid.Col span={3}>
          <StatsCard
            title="Beneficiaries"
            value="120"
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <StatsCard
            title="Activities"
            value="34"
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <StatsCard
            title="Workers"
            value="15"
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <StatsCard
            title="Urgent Cases"
            value="5"
          />
        </Grid.Col>

      </Grid>

      <Grid mb="lg">

        <Grid.Col span={8}>
          <RegionChart />
        </Grid.Col>

        <Grid.Col span={4}>
          <SummaryCard />
        </Grid.Col>

      </Grid>

      <DashboardTable
        data={tableData}
      />

    </NgoLayout>
  );
}

export default Dashboard;