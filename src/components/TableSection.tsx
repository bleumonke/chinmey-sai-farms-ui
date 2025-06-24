import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import SearchInput from "./SearchInput";
import DataTable, { ColumnDef } from "./DataTable";


interface TableSectionProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  onAddNew: () => void;
  onViewDetails: (id: string | number) => void;
  searchPlaceholder?: string;
  searchFields: (keyof T)[];
}

function TableSection<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  isError,
  error,
  onAddNew,
  onViewDetails,
  searchPlaceholder = "Search...",
  searchFields,
}: TableSectionProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data?.filter((item) =>
    searchFields
      .map((field) => String(item[field] ?? ""))
      .join(" ")
      .toLowerCase()
      .includes(searchQuery)
  );

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid
        container
        size={12}
        spacing={2}
        alignItems={"center"}
        justifyContent={"flex-end"}
      >
        <Grid>
          <SearchInput
            value={searchQuery}
            onChange={(value) => setSearchQuery(value.toLowerCase())}
            placeholder={searchPlaceholder}
          />
        </Grid>
        <Grid>
          <Button
            variant="outlined"
            sx={{ backgroundColor: "royalblue", color: "white" }}
            onClick={onAddNew}
            disabled={isLoading}
          >
            Create
          </Button>
        </Grid>
      </Grid>

      <Grid size={12}>
        <DataTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          onViewDetails={onViewDetails}
          errorMessage={
            isError
              ? error?.message ?? "There was an error loading the data."
              : undefined
          }
        />
      </Grid>
    </Grid>
  );
}

export default TableSection;