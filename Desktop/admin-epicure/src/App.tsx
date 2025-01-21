import React from 'react';

import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import Dashboard from './pages/dashboard/Dashboard';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
};

export default App;
