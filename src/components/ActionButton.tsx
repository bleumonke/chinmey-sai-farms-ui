/**
 *
 * ActionButton Component
 * A reusable button that supports both MUI theme colors and custom hex/RGB/HTML colors.
 *
 * Example usage:
 *  - MUI color: <ActionButton label="Save" color="success" />
 *  - Custom color: <ActionButton label="Custom" color="#673ab7" />
 *
 */

import React from 'react';
import { Button, ButtonProps } from '@mui/material';

type MUIColor = ButtonProps['color'];
type ActionColor = MUIColor | string | undefined;

interface ActionButtonProps extends Omit<ButtonProps, 'color'> {
  label: string;
  onClick: () => void;
  color?: ActionColor;
  fullWidth?: boolean;
}

// Type predicate to check if color is a MUI theme color
const isMUIColor = (color?: string): color is MUIColor =>
  typeof color === "string" &&
  ['inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning'].includes(color);

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  sx,
  ...rest
}) => {
  // Determine if color is a custom string (not one of MUI predefined colors)
  const isCustomColor = color !== undefined && !isMUIColor(color);

  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...(isCustomColor ? {} : { color })}
      sx={{
        alignSelf: 'flex-end',
        ...(isCustomColor && {
          backgroundColor: color,
          color: '#fff',
          '&:hover': {
            backgroundColor: `${color}cc`, // 80% opacity on hover
          },
        }),
        ...sx,
      }}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
