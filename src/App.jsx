import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Layout from './components/Layout';
import { ExpensesPage } from "./components/ExpensesPage";
import { IncomesPage } from "./components/IncomesPage";
import { ToastContainer } from 'react-toastify';
import { WorkersPage } from "./components/WorkersPage";
import { ProjectsPage } from "./components/ProjectsPage";
import { ExpenseCategoriesPage } from "./components/ExpenseCategoriesPage";
import 'react-toastify/dist/ReactToastify.css';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/incomes" element={<IncomesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/workers" element={<WorkersPage />} />
            <Route path="/expense-categories" element={<ExpenseCategoriesPage />} />
          </Routes>
          <ToastContainer />
        </Layout>
      </Router>
    </ApolloProvider>
  )
}

export default App
