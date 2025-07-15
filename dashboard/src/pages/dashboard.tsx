import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Plot from "react-plotly.js";
import { stringify } from "query-string";
import { chain, sumBy } from "lodash";
import {
  Title,
  useList,
  ListContextProvider,
  DataTable,
  fetchUtils,
} from "react-admin";

import { API_BASE_URL } from "../utils/common";
import { Stack } from "@mui/material";

const httpClient = async (url, options = {}) => {
  const { status, headers, body, json } = await fetchUtils.fetchJson(
    url,
    options,
  );
  return { status, headers, body, json };
};

const TopDriversByWins = () => {
  const query = {
    range: "[0, 9]",
  };
  const url = `${API_BASE_URL}/dashboard/top_drivers_by_wins?${stringify(query)}`;
  const options = {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
    }),
  };
  const [data, setData] = useState(null);
  useEffect(() => {
    httpClient(url, options).then(({ headers, json }) => {
      setData(json);
    });
  }, []);
  const listContext = useList({ data });
  if (data) {
    return (
      <Stack direction="column" spacing={2}>
        <ListContextProvider value={listContext}>
          <DataTable resource="drivers" sx={{ boxShadow: 1 }}>
            <DataTable.Col source="id" />
            <DataTable.Col source="full_name" />
            <DataTable.Col source="nationality" />
            <DataTable.Col source="number_of_wins" />
          </DataTable>
        </ListContextProvider>

        <DriverPlotByNationality data={data} />
      </Stack>
    );
  }
  return null;
};

const TopConstructorsByWins = () => {
  const query = {
    range: "[0, 9]",
  };
  const url = `${API_BASE_URL}/dashboard/top_constructors_by_wins?${stringify(query)}`;
  const options = {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
    }),
  };
  const [data, setData] = useState(null);
  useEffect(() => {
    httpClient(url, options).then(({ headers, json }) => {
      setData(json);
    });
  }, []);
  const listContext = useList({ data });
  if (data) {
    return (
      <Stack direction="column" spacing={2}>
        <ListContextProvider value={listContext}>
          <DataTable resource="constructors" sx={{ boxShadow: 1 }}>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="nationality" />
            <DataTable.Col source="points" />
          </DataTable>
        </ListContextProvider>

        <ConstructorPlotByNationality data={data} />
      </Stack>
    );
  }
  return null;
};

const ConstructorPlotByNationality = ({ data }) => {
  const plotData = chain(data)
    .groupBy("nationality")
    .map((values, key) => ({
      key,
      value: sumBy(values, "points"),
    }))
    .valueOf();

  return (
    <Plot
      data={[
        {
          x: plotData.map((item) => item.key),
          y: plotData.map((item) => item.value),
          type: "bar",
        },
      ]}
      layout={{ title: { text: "Constructor Points by Country" } }}
    />
  );
};

const DriverPlotByNationality = ({ data }) => {
  const plotData = chain(data)
    .groupBy("nationality")
    .map((values, key) => ({
      key,
      value: sumBy(values, "number_of_wins"),
    }))
    .valueOf();

  return (
    <Plot
      data={[
        {
          x: plotData.map((item) => item.key),
          y: plotData.map((item) => item.value),
          type: "bar",
        },
      ]}
      layout={{ title: { text: "Driver Wins by Country" } }}
    />
  );
};

export const Dashboard = () => (
  <Card sx={{ m: 2, p: 2 }}>
    <Title title="F1 Dashboard" />
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "left" }}>
            Top Drivers by Wins
          </Typography>
          <TopDriversByWins />
        </Grid>
        <Grid size={6}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "left" }}>
            Top Constructors by Points
          </Typography>
          <TopConstructorsByWins />
        </Grid>
      </Grid>
    </Box>
  </Card>
);
