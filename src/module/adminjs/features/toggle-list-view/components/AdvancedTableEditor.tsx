import {
  RECORDS_PER_PAGE
} from "@/module/adminjs/constant/pagination.constants";
import { Alert, Box, Chip, Snackbar, Stack } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel
} from "@mui/x-data-grid";
import { ActionProps, ApiClient } from "adminjs";
import React, { useEffect, useState } from "react";


enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  ARCHIVED = 'ARCHIVED'
}

enum AuthorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

type RelatedRecord = {
  id: string;
  title: string;
};

type RelatedRecords = Record<string, RelatedRecord[]>;

type FlatRecord = {
  id: string;
  [key: string]: any;
};

type NotificationState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const EMPTY_OPTION = { value: null, label: "-- NONE --" };

const AdvancedTableEditor: React.FC<ActionProps> = ({ resource }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const api = new ApiClient();
  const [relatedRecords, setRelatedRecords] = useState<RelatedRecords>({});
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "success"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.resourceAction({
        resourceId: resource.id,
        actionName: "list",
        params: {
          perPage: RECORDS_PER_PAGE
        }
      });
      setRecords(response.data.records);
    } catch (error) {
      console.error("Error fetching records:", error);
      showNotification("Error fetching records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRelatedRecords = async () => {
      const relatedData: RelatedRecords = {};
      const fetchPromises = Object.entries(resource.properties || {})
        .filter(([_, property]) => property.reference)
        .map(async ([key, property]) => {
          try {
            const response = await api.resourceAction({
              resourceId: property.reference,
              actionName: "list",
              params: {
                perPage: RECORDS_PER_PAGE
              }
            });

            let records = response.data.records;
            return { key, records };
          } catch (error) {
            console.error(`Error fetching related records for ${key}:`, error);
            return { key, records: [] };
          }
        });

      const results = await Promise.all(fetchPromises);
      results.forEach(({ key, records }) => {
        if (records) {
          relatedData[key] = records;
        }
      });

      setRelatedRecords(relatedData);
    };

    fetchRelatedRecords();
  }, []);

  /**
   * Transforms AdminJS's flattened record format into a normalized structure for the DataGrid.
   *
   * AdminJS stores array fields using dot notation (e.g., 'tags.0', 'tags.1')
   * which needs to be converted back into actual arrays for proper display.
   *
   * Example:
   * Input: { id: '1', params: { 'tags.0': 'tag1', 'tags.1': 'tag2', name: 'John' } }
   * Output: { id: '1', name: 'John', tags: ['tag1', 'tag2'] }
   *
   * @param records - Array of AdminJS records with flattened structure
   * @returns An Array of normalized records with proper array fields
   */
  const transformRecords = (records: any[]): FlatRecord[] => {
    const normalizedRecords = records.map(record => {
      if (!record.params) return { id: record.id };

      const normalizedRecord = Object.entries(record.params).reduce((normalizedFields, [fieldPath, value]) => {
        const [fieldName, arrayIndex] = fieldPath.split(".");
        const isNonArrayField = !arrayIndex;
        const isUninitializedArrayField = !normalizedFields[fieldName];

        if (isNonArrayField) {
          normalizedFields[fieldPath] = value;
          return normalizedFields;
        }
        if (isUninitializedArrayField) {
          normalizedFields[fieldName] = [];
        }

        normalizedFields[fieldName][parseInt(arrayIndex)] = value;

        return normalizedFields;
      }, {} as Record<string, any>);

      return { id: record.id, ...normalizedRecord };
    });

    const hasStatusField = normalizedRecords.some(record => 'status' in record);
    if (!hasStatusField) {
      return normalizedRecords;
    }

    const STATUSES_TO_SORT_LAST = [
      BookStatus.ARCHIVED,
      AuthorStatus.INACTIVE,
    ];

    const getStatusFromRecord = (record: FlatRecord): string => {
      return String(record?.['status'] ?? '').toUpperCase();
    };

    const compareRecordsByStatus = (recordA: FlatRecord, recordB: FlatRecord): number => {
      const statusA = getStatusFromRecord(recordA);
      const statusB = getStatusFromRecord(recordB);

      const isStatusALast = STATUSES_TO_SORT_LAST.includes(statusA as any);
      const isStatusBLast = STATUSES_TO_SORT_LAST.includes(statusB as any);

      if (isStatusALast && !isStatusBLast) return 1;
      if (!isStatusALast && isStatusBLast) return -1;
      return 0;
    };

    return normalizedRecords.sort(compareRecordsByStatus);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message: string, severity: NotificationState["severity"]) => {
    setNotification({ open: true, message, severity });
  };

  const handleProcessRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
    const updatedRowValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(newRow)) {
      const oldValue = oldRow[key];
      const hasValueChanged = value !== oldValue;
      const isNotEmptyNullEquivalent = !(
        (value === "" && oldValue === null) ||
        (value === null && oldValue === "")
      );

      if (hasValueChanged && isNotEmptyNullEquivalent) {
        updatedRowValues[key] = value;
      }
    }

    const hasRowChanged = Object.keys(updatedRowValues).length > 0;
    if (!hasRowChanged) {
      return oldRow;
    }

    try {
      const response = await api.recordAction({
        resourceId: resource.id,
        actionName: "edit",
        recordId: newRow.id,
        data: updatedRowValues
      });

      if (response.data.notice) {
        showNotification(`Record ID ${newRow.id} successfully updated`, "success");
      }

      fetchData();
      return newRow;
    } catch (error) {
      showNotification(`Error updating Record ID ${newRow.id}: ${error.message || "Unknown error"}`, "error");
      throw error;
    }
  };

  const renderArrayField = (value: any[]) => (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
      {value.map((item, index) => (
        <Chip key={index} label={item} size="small" />
      ))}
    </Stack>
  );

  const createReferenceColumn = (baseColumn: GridColDef, key: string): GridColDef => ({
    ...baseColumn,
    type: "singleSelect",
    valueOptions: [
      EMPTY_OPTION,
      ...relatedRecords[key].map(record => ({
        value: record.id,
        label: record.title
      }))
    ],
    renderCell: (params: GridRenderCellParams) => {
      if (!params?.value) {
        return "";
      }
      const record = relatedRecords[key].find(r => r.id === params.value);
      return record?.title || "";
    },
    valueFormatter: (params: { value: any }) => {
      if (!params?.value) {
        return "";
      }
      const record = relatedRecords[key].find(r => r.id === params.value);
      return record?.title || "";
    }
  });

  const createArrayColumn = (baseColumn: GridColDef): GridColDef => ({
    ...baseColumn,
    editable: false,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.row[baseColumn.field];
      return Array.isArray(value) ? renderArrayField(value) : value?.toString() || "";
    }
  });

  const createEnumColumn = (baseColumn: GridColDef, property: any): GridColDef => ({
    ...baseColumn,
    type: "singleSelect",
    valueOptions: property.availableValues
  });

  const formatDate = (value: any) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const createDateColumn = (baseColumn: GridColDef): GridColDef => ({
    ...baseColumn,
    type: "dateTime",
    renderCell: (params: GridRenderCellParams) => {
      if (!params?.row) return "";
      return formatDate(params.row[baseColumn.field]);
    },
    valueFormatter: (params: { value: any }) => {
      if (!params) return "";
      return formatDate(params.value);
    }
  });

  const createColumns = (): GridColDef[] => {
    return Object.entries(resource.properties || {}).map(([key, property], index) => {
      const baseColumn: GridColDef = {
        field: key,
        headerName: property.label || key,
        flex: 1,
        minWidth: 150,
        editable: key !== "id"
      };

      if (property.reference && relatedRecords[key]) {
        return createReferenceColumn(baseColumn, key);
      }

      if (property.availableValues) {
        return createEnumColumn(baseColumn, property);
      }

      if (property.isArray) {
        return createArrayColumn(baseColumn);
      }

      if (property.type === "datetime" || property.type === "date") {
        return createDateColumn(baseColumn);
      }

      return {
        ...baseColumn,
        renderCell: (params) => {
          const value = params.row[key];
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }
          return value?.toString() || "";
        }
      };
    });
  };

  return (
    <Box sx={{
      width: "100%",
      height: "100%",
      p: 3,
      backgroundColor: "white",
      borderRadius: 1,
      boxShadow: 1,
      "& .MuiDataGrid-root": {
        overflow: "visible"
      },
      "& .MuiDataGrid-main": {
        overflow: "visible"
      },
      "& .sticky-column-0, & .sticky-column-1": {
        position: "sticky !important",
        backgroundColor: "white !important",
        zIndex: 3,
        borderRight: "1px solid rgba(224, 224, 224, 1)",
        backgroundClip: "padding-box",
        "&::after": {
          content: "\"\"",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "4px",
          background: "linear-gradient(90deg, rgba(0,0,0,0.1), transparent)",
          pointerEvents: "none"
        }
      },
      "& .sticky-column-0": {
        left: "0px !important",
        backgroundColor: "white !important"
      },
      "& .sticky-column-1": {
        left: "150px !important",
        backgroundColor: "white !important"
      },
      "& .MuiDataGrid-columnHeader.sticky-column-0, & .MuiDataGrid-columnHeader.sticky-column-1": {
        zIndex: 4,
        backgroundColor: "white !important"
      },
      "& .MuiDataGrid-virtualScroller": {
        overflow: "auto !important",
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px"
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "white"
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "4px",
          backgroundColor: "rgba(0, 0, 0, 0.2)"
        }
      },
      "& .MuiDataGrid-virtualScrollerContent": {
        minWidth: "fit-content !important"
      },
      "& .MuiDataGrid-virtualScrollerRenderZone": {
        position: "relative"
      }
    }}>
      <Box sx={{
        width: "100%",
        overflow: "hidden",
        position: "relative"
      }}>
        <DataGrid
          ignoreDiacritics={true}
          resizeThrottleMs={0}
          rows={transformRecords(records || [])}
          columns={createColumns().map((col, index) => {
            const isFirstTwoColumns = index < 2;
            const isFlex = isFirstTwoColumns ? 0 : 1;
            return {
              ...col,
              cellClassName: isFirstTwoColumns ? `sticky-column-${index}` : "",
              headerClassName: isFirstTwoColumns ? `sticky-column-${index}` : "",
              width: 150,
              flex: isFlex
            };
          })}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 100 }
            }
          }}
          pageSizeOptions={[50, 100]}
          disableRowSelectionOnClick
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => showNotification(error.message || "An error occurred while saving", "error")}
          disableVirtualization
        />
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdvancedTableEditor;
