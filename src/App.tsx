import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TestBuilder from './pages/TestBuilder';
import TestLibrary from './pages/TestLibrary';
import ReportDashboard from './pages/ReportDashboard';
import ReportDetail from './pages/ReportDetail';
import { TestProvider } from './context/TestContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <TestProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<TestBuilder />} />
              <Route path="/library" element={<TestLibrary />} />
              <Route path="/reports" element={<ReportDashboard />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
            </Routes>
          </Layout>
        </TestProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;