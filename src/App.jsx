import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Layout } from './components/Layout';
import { ExpensesPage } from "./components/ExpensesPage";
import { IncomesPage } from "./components/IncomesPage";
import { ToastContainer } from 'react-toastify';
import { WorkersPage } from "./components/WorkersPage";
import { ProjectsPage } from "./components/ProjectsPage";
import { ExpenseCategoriesPage } from "./components/ExpenseCategoriesPage";
import { LoginPage } from "./components/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import 'react-toastify/dist/ReactToastify.css';

const token = localStorage.getItem('access_token');

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* <Route 
            path="*" 
            element={<Navigate to="/expenses" replace />} 
          /> */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/incomes" element={<IncomesPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/workers" element={<WorkersPage />} />
                    <Route path="/expense-categories" element={<ExpenseCategoriesPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ApolloProvider>
  )
}

export default App
