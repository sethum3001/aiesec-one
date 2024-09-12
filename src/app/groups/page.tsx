"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import React, { ChangeEvent, useMemo, useState } from "react";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable
} from "mantine-react-table";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconLink, IconTrash } from "@tabler/icons-react";
import classes from "./groups.module.scss";
import { ResourceResponse } from "@/types/ResourceResponse";
import {
  useCreateResource,
  useDeleteResource,
  useGetResources,
  useUpdateResource
} from "@/hooks/resources";
import { validateRequired, validateUrl } from "@/util/dataUtils";

// Function to validate a resource, checking for required fields and valid URLs
function validateResource(resource: ResourceResponse) {
  return {
    title: !validateRequired(resource.title) ? "Title is Required" : "",
    // description: !validateRequired(resource.description) ? "Description is Required" : "",
    originalUrl: !validateRequired(resource.originalUrl)
      ? "Original URL is required"
      : !validateUrl(resource.originalUrl)
        ? "Invalid URL, please enter full URL"
        : "",
    shortLink: !validateRequired(resource.shortLink)
      ? "Short link is required"
      : "",
    // functions: !validateRequired(resource.functions) ? "Functions are Required" : "",
    keywords: !validateRequired(resource.keywords)
      ? "Keywords are Required"
      : ""
  };
}

// Main component for displaying and managing groups
const GroupsPage = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [shortLinkInModal, setShortLinkInModal] = useState<string>("");

  const resetInputs = () => {
    setValidationErrors({});
    setShortLinkInModal("");
  };

    // useMemo to define columns of the table, each column has header and validation
  const columns = useMemo<MRT_ColumnDef<ResourceResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.name
        }
      },
      {
        accessorKey: "members",
        header: "Members",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.members
        }
      },
      {
        accessorKey: "creator",
        header: "Created By",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.creator
        }
      },
    {
        accessorKey: "date",
        header: "Created On",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.date
        }
      },

    ],
    [validationErrors, shortLinkInModal]
  );

  // Custom hooks for CRUD operations
  // @ts-ignore
  const { mutateAsync: createResource, isLoading: isCreatingResource } =
    useCreateResource();
  const {
    data: fetchedResources = [],
    isError: isLoadingResourcesError,
    isFetching: isFetchingResources,
    isLoading: isLoadingResources
  } = useGetResources();
  // @ts-ignore
  const { mutateAsync: updateResource, isLoading: isUpdatingResource } =
    useUpdateResource();
  // @ts-ignore
  const { mutateAsync: deleteResource, isLoading: isDeletingResource } =
    useDeleteResource();

  // Handlers for CRUD operations related to resource
  const handleCreateResource: MRT_TableOptions<ResourceResponse>["onCreatingRowSave"] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateResource(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      resetInputs();
      await createResource(values);
      exitCreatingMode();
    };

  const handleEditResource: MRT_TableOptions<ResourceResponse>["onEditingRowSave"] =
    async ({ row, values, table }) => {
      const newValidationErrors = validateResource(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      resetInputs();
      console.log(values);
      await updateResource({ ...values, _id: row.original._id });
      table.setEditingRow(null); //exit editing mode
    };

  const openDeleteConfirmModal = (row: MRT_Row<ResourceResponse>) =>
    modals.openConfirmModal({
      title: "Confirmation",
      children: (
        <Text>
          Are you sure you want to delete this record? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteResource(row.original._id)
    });

    // Initialize the MantineReactTable hook with table options and state
  const table = useMantineReactTable({
    columns,
    data: fetchedResources, // Fetched resources data
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true, // Enable editing functionality
    getRowId: (row) => row._id, // Define how to get row ID
    mantineToolbarAlertBannerProps: isLoadingResourcesError
      ? {
          color: "red",
          children: "Error loading data"
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: "500px"
      }
    },
    onCreatingRowCancel: () => resetInputs(), // Reset inputs on canceling row creation
    onCreatingRowSave: handleCreateResource, // Handle row creation
    onEditingRowCancel: () => resetInputs(), // Reset inputs on canceling row editing
    onEditingRowSave: handleEditResource, // Handle row editing
    positionActionsColumn: "last", // Place action column at the last position
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create Group</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Group</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => table.setEditingRow(row)}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            variant="subtle"
            size="sm"
            color="red"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    state: {
      isLoading: isLoadingResources,
      isSaving: isCreatingResource || isUpdatingResource || isDeletingResource,
      showAlertBanner: isLoadingResourcesError
    }
  });

return (
  <div className={classes.body}>
    <Box my={20}>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "24px", // Adjust margin bottom here
        }}
      >
        <Title mt={8} mb={24} order={1} style={{ color: "#1C7ED6" }}>
          Groups
        </Title>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between", // Adjust alignment if needed
          }}
        >
          <Button>Member List</Button>
          <Button
            onClick={() => {
              table.setCreatingRow(true);
            }}
          >
            New Group
          </Button>
          <Button>User Groups</Button>
        </Box>
      </Box>

      <div>
        <MantineReactTable table={table} />
      </div>
    </Box>
  </div>
);

};

export default GroupsPage;
