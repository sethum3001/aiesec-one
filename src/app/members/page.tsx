"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useMemo, useState, useEffect } from "react";
import  Link  from 'next/link';
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
  Box,
  Modal,
  FileButton
} from "@mantine/core";
import ImportMembersModal from "@/app/modals/importMembers.tsx";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import classes from "@/app/members/members.module.scss";
import { ResourceResponse } from "@/types/ResourceResponse";
import {
  useCreateResource,
  useDeleteResource,
  useGetResources,
  useUpdateResource
} from "@/app/hooks/resources";
import { validateRequired, validateUrl } from "@/app/util/dataUtils";
import Papa from "papaparse";

function validateResource(resource: ResourceResponse) {
  return {
    title: !validateRequired(resource.title) ? "Title is Required" : "",
    url: !validateUrl(resource.originalUrl) ? "Invalid URL Format" : "",
    // description: !validateRequired(resource.description) ? "Description is Required" : "",
    link: !validateUrl(resource.shortLink) ? "Invalid Link Format" : "",
    // functions: !validateRequired(resource.functions) ? "Functions are Required" : "",
    keywords: !validateRequired(resource.keywords)
      ? "Keywords are Required"
      : ""
  };
}

const MembersPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<ResourceResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name"
      },
      {
        accessorKey: "role",
        header: "Role"
      },
      {
        accessorKey: "entity",
        header: "Entity"
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "expa_id",
        header: "Expa ID"
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <div
            style={{
              height: "10px",
              width: "10px",
              backgroundColor: cell.getValue() === "Active" ? "green" : "red",
              borderRadius: "50%",
              display: "inline-block"
            }}
          />
        )
      },
      {
        accessorKey: "view",
        header: "View",
        Cell: () => <i className="bi-eye"></i> // Use the correct class for the eye icon
      }
    ],
    []
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
      <Title mt={8} mb={24} ml={15} order={1} style={{ color: "#1C7ED6" }}>
        Members
      </Title>
      <Box
        my={20}
        ml={15}
        style={{
          display: "flex",
          flexDirection: "row"
        }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search Members.."
            style={{ paddingLeft: "55px", width: "619px", height: "48px" }}
          />
          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              top: "50%",
              left: "25px",
              transform: "translateY(-50%)"
            }}
          ></i>
        </div>

        <Button 
          style={{ height: "48px", left: "35px" }}
          onClick={open}
        >
          <i
            className="bi bi-person-plus-fill"
            style={{ marginRight: "5px" }}
          ></i>
          Import Members
        </Button>

        <Link href='/accesscontrol'>
        <Button style={{ height: "48px", left: "55px" }}>
          <i className="bi bi-key-fill" style={{ marginRight: "5px" }}></i> 
          Access Control
        </Button>
        </Link>

        <Button style={{ height: "48px", left: "75px" }}>
          <i className="bi bi-people-fill" style={{ marginRight: "5px" }}></i>
          User Groups
        </Button>
      </Box>
      <div>
        <MantineReactTable table={table} />
      </div>

      <ImportMembersModal opened={opened} onClose={close} />
    </div>
  );
};

export default MembersPage;
