import { Box } from '@mui/material';
import pizza from '../assets/pizza_spinner.svg';

export const PizzaSpinner = () => (
  <Box
    component="img"
    src={pizza}
    alt="Pizza spinner"
    sx={{
      width: 70,
      height: 70,
      mr: 2,
      animation: 'spin 1.5s linear infinite',
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
    }}
  />
);