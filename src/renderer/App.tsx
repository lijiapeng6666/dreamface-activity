import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import AppPage from './pages/AppPage';
import ECommercePage from './pages/ECommercePage';
import AnalyticsPage from './pages/AnalyticsPage';
import BankingPage from './pages/BankingPage';
import BookingPage from './pages/BookingPage';
import FilePage from './pages/FilePage';
import CoursePage from './pages/CoursePage';
import UserPage from './pages/UserPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import InvoicePage from './pages/InvoicePage';
import BlogPage from './pages/BlogPage';
import JobPage from './pages/JobPage';

import './App.css';

function MainLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/ecommerce" element={<ECommercePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/banking" element={<BankingPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/file" element={<FilePage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/job" element={<JobPage />} />
        </Routes>
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
