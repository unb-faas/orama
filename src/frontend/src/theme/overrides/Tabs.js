// ----------------------------------------------------------------------

export default function Tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: 'none',
          },
          backgroundColor: theme.palette.grey[0]
        },
      }
    }
  };
}
