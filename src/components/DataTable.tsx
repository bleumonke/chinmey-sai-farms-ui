import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Skeleton,
  TablePagination,
  IconButton,
  Alert,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InboxIcon from '@mui/icons-material/Inbox';

export type ColumnDef<T> = {
  label: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  onViewDetails?: (id: string | number) => void;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  elevation?: number;
  errorMessage?: string;
}

function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  onViewDetails,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  elevation = 0,
  errorMessage,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer
      component={Paper}
      elevation={elevation}
      sx={{minHeight: 300}}
    >
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Table sx={{ borderCollapse: "collapse", minHeight: 100 }}>
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell
                key={i}
                sx={{
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                  backgroundColor: "royalblue",
                  color: "#FFFFFF",
                }}
              >
                {col.label}
              </TableCell>
            ))}
            {onViewDetails && (
              <TableCell sx={{ border: "1px solid #e0e0e0", backgroundColor: "royalblue" }} />
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
                {onViewDetails && (
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
                  backgroundColor: "white",
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
                {onViewDetails && (
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    <IconButton
                      size="small"
                      onClick={() => onViewDetails(row.id)}
                      aria-label="edit"
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                        borderRadius: "50%",
                        padding: 1,
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onViewDetails ? 1 : 0)}
                sx={{ border: "1px solid #e0e0e0", padding:4 , backgroundColor:'white' }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight={150}
                  width="100%"
                >
                  <InboxIcon fontSize="large"/>
                  <Typography variant="body1" color="text.secondary">Nothing to display</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={data.length}
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