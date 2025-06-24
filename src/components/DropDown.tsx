import React from "react";
import { Box, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface Button {
  title: string;
  value: string | number;
  onClick: () => void;
}

interface Item {
  id: string | number;
  name: string;
}

interface DropDownProps {
  selected: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  disabled?: boolean;
  isLoading?: boolean;
  items: Item[];
  button?: Button;
  label?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  selected,
  onChange,
  disabled = false,
  isLoading = false,
  items,
  button,
  label = "Select an option",
}) => {
  return (
    <Box sx={{ width: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" }, mb: 2 }}>
      <Select
        fullWidth
        variant="outlined"
        displayEmpty
        value={selected}
        onChange={onChange}
        disabled={disabled}
      >
        <MenuItem value="" disabled>
          {isLoading ? "Loading..." : label}
        </MenuItem>
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
        {button && (
          <MenuItem
            value={button.value}
            sx={{ fontStyle: "italic", color: "primary.main" }}
            onClick={button.onClick}
          >
            {button.title}
          </MenuItem>
        )}
      </Select>
    </Box>
  );
};

export default DropDown;
