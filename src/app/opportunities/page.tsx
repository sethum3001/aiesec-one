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
import classes from "./opportunities.module.scss";
import { OpportunityResponse } from "@/app/types/OpportunityResponse";
import {
  useCreateOpportunity,
  useDeleteOpportunity,
  useGetOpportunities,
  useUpdateOpportunity
} from "@/app/hooks/opportunities";
import { validateRequired, validateUrl } from "@/app/util/dataUtils";

function validateOpportunity(opportunity: OpportunityResponse) {
  return {
    title: !validateRequired(opportunity.title) ? "Title is Required" : "",
    url: !validateUrl(opportunity.url) ? "Invalid URL Format" : "",
    // description: !validateRequired(opportunity.description) ? "Description is Required" : "",
    link: !validateUrl(opportunity.link) ? "Invalid Link Format" : "",
    // functions: !validateRequired(opportunity.functions) ? "Functions are Required" : "",
    keywords: !validateRequired(opportunity.keywords)
      ? "Keywords are Required"
      : ""
  };
}

const OpportunitiesPage = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<OpportunityResponse>[]>(
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
  // @ts-ignore
  const { mutateAsync: createOpportunity, isLoading: isCreatingOpportunity } =
    useCreateOpportunity();
  const {
    data: fetchedOpportunities = [],
    isError: isLoadingOpportunitiesError,
    isFetching: isFetchingOpportunities,
    isLoading: isLoadingOpportunities
  } = useGetOpportunities();
  // @ts-ignore
  const { mutateAsync: updateOpportunity, isLoading: isUpdatingOpportunity } =
    useUpdateOpportunity();
  // @ts-ignore
  const { mutateAsync: deleteOpportunity, isLoading: isDeletingOpportunity } =
    useDeleteOpportunity();

  // Handlers for CRUD operations
  const handleCreateOpportunity: MRT_TableOptions<OpportunityResponse>["onCreatingRowSave"] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateOpportunity(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createOpportunity(values);
      exitCreatingMode();
    };

  const handleEditOpportunity: MRT_TableOptions<OpportunityResponse>["onEditingRowSave"] =
    async ({ row, values, table }) => {
      const newValidationErrors = validateOpportunity(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      console.log(values);
      await updateOpportunity({ ...values, _id: row.original._id });
      table.setEditingRow(null); //exit editing mode
    };

  const openDeleteConfirmModal = (row: MRT_Row<OpportunityResponse>) =>
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
      onConfirm: () => deleteOpportunity(row.original._id)
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedOpportunities,
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row._id,
    mantineToolbarAlertBannerProps: isLoadingOpportunitiesError
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
    onCreatingRowSave: handleCreateOpportunity,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditOpportunity,
    positionActionsColumn: "last",
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create Opportunity</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Opportunity</Title>
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
      isLoading: isLoadingOpportunities,
      isSaving:
        isCreatingOpportunity || isUpdatingOpportunity || isDeletingOpportunity,
      showAlertBanner: isLoadingOpportunitiesError,
      showProgressBars: isFetchingOpportunities
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
          Opportunities
        </Title>
        <Button
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Create Opportunity
        </Button>
      </Box>
      <div>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default OpportunitiesPage;
