"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import { useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable
} from "mantine-react-table";
import {
  ActionIcon,
  Button,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip,
  Box
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import classes from "./resources.module.scss";
import { ResourceResponse } from "@/app/types/ResourceResponse";
import {
  useCreateResource,
  useDeleteResource,
  useGetResources,
  useUpdateResource
} from "@/app/hooks/resources";
import { validateRequired, validateUrl } from "@/app/util/dataUtils";

function validateResource(resource: ResourceResponse) {
  return {
    title: !validateRequired(resource.title) ? "Title is Required" : "",
    url: !validateUrl(resource.url) ? "Invalid URL Format" : "",
    // description: !validateRequired(resource.description) ? "Description is Required" : "",
    link: !validateUrl(resource.link) ? "Invalid Link Format" : "",
    // functions: !validateRequired(resource.functions) ? "Functions are Required" : "",
    keywords: !validateRequired(resource.keywords)
      ? "Keywords are Required"
      : ""
  };
}

const ResourcesPage = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<ResourceResponse>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.title
        }
      },
      {
        accessorKey: "url",
        header: "URL",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.url,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              url: undefined
            })
        }
      },
      {
        accessorKey: "description",
        header: "Description",
        mantineEditTextInputProps: {
          type: "text",
          error: validationErrors?.description,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined
            })
        }
      },
      {
        accessorKey: "link",
        header: "Link",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.link,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              link: undefined
            })
        }
      },
      {
        accessorKey: "functions",
        header: "Functions",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.functions,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              functions: undefined
            })
        }
      },
      {
        accessorKey: "keywords",
        header: "Keywords",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.keywords,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              keywords: undefined
            })
        }
      }
    ],
    [validationErrors]
  );

  // Custom hooks for CRUD operations
  const { mutateAsync: createResource, isLoading: isCreatingResource } =
    useCreateResource();
  const {
    data: fetchedResources = [],
    isError: isLoadingResourcesError,
    isFetching: isFetchingResources,
    isLoading: isLoadingResources
  } = useGetResources();
  const { mutateAsync: updateResource, isLoading: isUpdatingResource } =
    useUpdateResource();
  const { mutateAsync: deleteResource, isLoading: isDeletingResource } =
    useDeleteResource();

  // Handlers for CRUD operations
  const handleCreateResource: MRT_TableOptions<ResourceResponse>["onCreatingRowSave"] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateResource(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
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
      setValidationErrors({});
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

  const table = useMantineReactTable({
    columns,
    data: fetchedResources,
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row._id,
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
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateResource,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditResource,
    positionActionsColumn: "last",
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create Resource</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Resource</Title>
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
      showAlertBanner: isLoadingResourcesError,
      showProgressBars: isFetchingResources
    }
  });

  return (
    <div className={classes.body}>
      <Box
        my={20}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Title mt={8} mb={24} order={1} style={{ color: "#1C7ED6" }}>
          Resources
        </Title>
        <Button
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Create Resource
        </Button>
      </Box>
      <div>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default ResourcesPage;
