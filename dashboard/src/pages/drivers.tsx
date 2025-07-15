import {
  DataTable,
  DateField,
  List,
  Show,
  SimpleShowLayout,
  TextField,
  UrlField,
  CreateButton,
  ExportButton,
  TopToolbar,
  SimpleForm,
  TextInput,
  EditButton,
  DeleteButton,
  Create,
  DateInput,
  required,
  Edit,
} from "react-admin";

const DriverListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const DriverList = () => (
  <List actions={<DriverListActions />}>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="driver_ref" />
      <DataTable.Col source="number" />
      <DataTable.Col source="code" />
      <DataTable.Col source="forename" />
      <DataTable.Col source="surname" />
      <DataTable.Col source="dob">
        <DateField source="dob" />
      </DataTable.Col>
      <DataTable.Col source="nationality" />
      <DataTable.Col source="url">
        <UrlField source="url" />
      </DataTable.Col>
    </DataTable>
  </List>
);

const DriverShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const DriverShow = () => (
  <Show actions={<DriverShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="driver_ref" />
      <DateField source="number" />
      <TextField source="code" />
      <TextField source="forename" />
      <TextField source="surname" />
      <DateField source="dob" />
      <TextField source="nationality" />
      <UrlField source="url" />
    </SimpleShowLayout>
  </Show>
);

export const DriverCreate = () => (
  <Create redirect="list">
    <DriverSimpleForm />
  </Create>
);

export const DriverEdit = () => {
  return (
    <Edit redirect="list">
      <DriverSimpleForm />
    </Edit>
  );
};

const DriverSimpleForm = () => (
  <SimpleForm>
    <TextInput source="id" validate={[required()]} />
    <TextInput source="driver_ref" validate={[required()]} />
    <TextInput source="number" validate={[required()]} />
    <TextInput source="code" validate={[required()]} />
    <TextInput source="forename" validate={[required()]} />
    <TextInput source="surname" validate={[required()]} />
    <DateInput source="dob" validate={[required()]} />
    <TextInput source="nationality" validate={[required()]} />
    <TextInput source="url" validate={[required()]} />
  </SimpleForm>
);
