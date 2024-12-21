import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, ApolloProvider } from '@apollo/client';
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

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('access_token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
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
                    <Route path="*" element={<Navigate to="/expenses" replace />} />
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
