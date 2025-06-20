import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Sidebar from './components/Sidebar';
import AppPage from './pages/app/AppPage';
import ActivityPage from './pages/activity/activityPage';

import './App.css';

function MainLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mb: 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/activity" element={<ActivityPage />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
