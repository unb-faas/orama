import { ConfirmProvider } from 'material-ui-confirm';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ConfirmProvider>
      <ThemeConfig>
        <ScrollToTop />
        <Router />
      </ThemeConfig>
    </ConfirmProvider>
  );
}
