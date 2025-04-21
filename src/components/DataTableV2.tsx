import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Skeleton,
} from "@mui/material";

export type ColumnDef<T> = {
  label: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T extends { id: string | number }> {
  title: string;
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  onViewDetails?: (id: string | number) => void;
}

function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  loading = false,
  addButtonLabel = "Add New",
  onAddClick,
  onViewDetails,
}: DataTableProps<T>) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "auto",
        margin: "auto",
        boxShadow: "none",
        borderRadius: 0,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        sx={{ backgroundColor: "#ece0d1" }}
      >
        <Typography variant="h6" sx={{ color: "black" }}>
          {title}
        </Typography>
        {onAddClick && (
          <Button variant="outlined" color="primary" size="small" onClick={onAddClick}>
            {addButtonLabel}
          </Button>
        )}
      </Box>

      <Table
        sx={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell
                key={i}
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f0f0f0",
                }}
              >
                {col.label}
              </TableCell>
            ))}
            {onViewDetails && (
              <TableCell
                sx={{
                  borderRight: "1px solid #ddd",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f0f0f0",
                }}
              />
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell
                      key={j}
                      sx={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                  ))}
                  {onViewDetails && (
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            : data.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    backgroundColor: rowIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {columns.map((col, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        borderRight: "1px solid #ddd",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {col.render ? col.render(row) : String(row[col.accessor] ?? "-")}
                    </TableCell>
                  ))}
                  {onViewDetails && (
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => onViewDetails(row.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
