import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AppRoutes from './routes';

const theme = createTheme({
  primaryColor: 'teal',
  colors: {
    brand: [
      '#E6F7F5',
      '#CCEFEB',
      '#99DFD7',
      '#66CFC3',
      '#33BFAF',
      '#00AF9B',
      '#008C7C',
      '#00695D',
      '#00463E',
      '#00231F',
    ],
  },
  primaryShade: 6,
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: '600',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        padding: 'lg',
      },
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;