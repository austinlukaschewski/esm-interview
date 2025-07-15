import {
  DataTable,
  DateField,
  List,
  NumberField,
  ReferenceField,
  ReferenceManyField,
  ReferenceOneField,
  Show,
  FunctionField,
  TabbedShowLayout,
  TextField,
  UrlField,
} from "react-admin";
import { Stack } from "@mui/material";

export const RaceList = () => (
  <List storeKey={false}>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.NumberCol source="year" />
      <DataTable.NumberCol source="round" />
      <DataTable.Col source="circuit_id">
        <ReferenceField source="circuit_id" reference="circuits" />
      </DataTable.Col>
      <DataTable.Col source="name" />
      <DataTable.Col source="date">
        <DateField source="date" />
      </DataTable.Col>
      <DataTable.Col source="time" />
      <DataTable.Col source="url">
        <UrlField source="url" />
      </DataTable.Col>
      <DataTable.Col source="fp1_date" />
      <DataTable.Col source="fp1_time" />
      <DataTable.Col source="fp2_date" />
      <DataTable.Col source="fp2_time" />
      <DataTable.Col source="fp3_date" />
      <DataTable.Col source="fp3_time" />
      <DataTable.Col source="quali_date" />
      <DataTable.Col source="quali_time" />
      <DataTable.Col source="sprint_date" />
      <DataTable.Col source="sprint_time" />
    </DataTable>
  </List>
);

export const RaceShow = () => (
  <Show>
    <TabbedShowLayout>
      <TabbedShowLayout.Tab label="summary">
        <TextField source="id" />
        <NumberField source="year" />
        <NumberField source="round" />
        <ReferenceField source="circuit_id" reference="circuits" />
        <TextField source="name" />
        <DateField source="date" />
        <TextField source="time" />
        <UrlField source="url" />
        <TextField source="fp1_date" />
        <TextField source="fp1_time" />
        <TextField source="fp2_date" />
        <TextField source="fp2_time" />
        <TextField source="fp3_date" />
        <TextField source="fp3_time" />
        <TextField source="quali_date" />
        <TextField source="quali_time" />
        <TextField source="sprint_date" />
        <TextField source="sprint_time" />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="circuit" path="circuit">
        {[
          "ID",
          "Circuit_Ref",
          "Name",
          "Location",
          "Country",
          "Lat",
          "Lng",
          "Alt",
          "Url",
        ].map((label) => (
          <ReferenceOneField
            key={label}
            label={label}
            source="circuit_id"
            reference="circuits"
            target="id"
          >
            <TextField source={label.toLowerCase()} />
          </ReferenceOneField>
        ))}
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="drivers" path="drivers">
        <ReferenceManyField
          reference="driver_standings"
          target="race_id"
          sort={{ field: "position", order: "ASC" }}
        >
          <DataTable sort={{ field: "position", order: "ASC" }}>
            <DataTable.Col source="position" />
            <DataTable.Col source="points" />
            <DataTable.Col source="driver_id">
              <ReferenceField source="driver_id" reference="drivers">
                <FunctionField
                  render={(data) =>
                    `${data.number === "\\N" ? "" : `#${data.number}`} ${data.forename} ${data.surname}`
                  }
                />
              </ReferenceField>
            </DataTable.Col>
          </DataTable>
        </ReferenceManyField>
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="contructors" path="contructors">
        <ReferenceManyField
          reference="constructor_standings"
          target="race_id"
          sort={{ field: "position", order: "ASC" }}
        >
          <DataTable sort={{ field: "position", order: "ASC" }}>
            <DataTable.Col source="position" />
            <DataTable.Col source="points" />
            <DataTable.Col source="constructor_id">
              <ReferenceField source="constructor_id" reference="constructors">
                <TextField source="name" />
              </ReferenceField>
            </DataTable.Col>
            <DataTable.Col source="constructor_id" label="Nationality">
              <ReferenceField source="constructor_id" reference="constructors">
                <TextField source="nationality" />
              </ReferenceField>
            </DataTable.Col>
          </DataTable>
        </ReferenceManyField>
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>
);
