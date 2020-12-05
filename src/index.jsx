import React from 'react';
import ReactDOM from 'react-dom';
import App from './_app';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './components/atoms/theme';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app')
);
