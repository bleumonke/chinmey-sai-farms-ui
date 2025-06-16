import React, { useState } from "react";
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
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  onDelete?: (id: string | number) => void;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  elevation?: number;
}

function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  loading = false,
  addButtonLabel = "Add New",
  onAddClick,
  onViewDetails,
  onDelete,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  elevation = 0,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setPage(0);
  };

  const handleDelete = (id: string | number) => {
    const confirm = window.confirm("Are you sure you want to delete this record?");
    if (confirm && onDelete) {
      onDelete(id);
    }
  };

  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.accessor];
      return value?.toString().toLowerCase().includes(searchQuery);
    })
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer
      component={Paper}
      elevation={elevation}
      sx={{
        minHeight: 300,
        padding: 2,
        backgroundColor: "#f8f8ff",
        borderRadius: 5,
      }}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="center" p={2} gap={2}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {onAddClick && (
            <Button variant="outlined" size="small" onClick={onAddClick}>
              {addButtonLabel}
            </Button>
          )}
        </Box>
      </Box>

      <Table sx={{ borderCollapse: "collapse", minHeight: 100 }}>
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell
                key={i}
                sx={{
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                  backgroundColor: "#333333",
                  color: "#FFFFFF",
                }}
              >
                {col.label}
              </TableCell>
            ))}
            {(onViewDetails || onDelete) && (
              <TableCell sx={{ border: "1px solid #e0e0e0", backgroundColor: "#333333" }} />
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: rowsPerPage }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((_, j) => (
                  <TableCell key={j} sx={{ border: "1px solid #e0e0e0" }}>
                    <Skeleton variant="text" width="100%" />
                  </TableCell>
                ))}
                {(onViewDetails || onDelete) && (
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    <Skeleton variant="rectangular" width={100} height={36} />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                {columns.map((col, i) => (
                  <TableCell key={i} sx={{ border: "1px solid #e0e0e0" }}>
                    {col.render ? col.render(row) : String(row[col.accessor] ?? "-")}
                  </TableCell>
                ))}
                {(onViewDetails || onDelete) && (
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {onViewDetails && (
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails(row.id)}
                        aria-label="edit"
                        sx={{
                          backgroundColor: "royalblue",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#115293",
                          },
                          borderRadius: "50%",
                          padding: 1,
                          marginRight: 1,
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(row.id)}
                        aria-label="delete"
                        sx={{
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#9a0007",
                          },
                          borderRadius: "50%",
                          padding: 1,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onViewDetails || onDelete ? 1 : 0)}
                sx={{ border: "1px solid #e0e0e0", padding: 4 }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight={150}
                  width="100%"
                >
                  <InboxIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Nothing to display
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </TableContainer>
  );
}

export default DataTable;
