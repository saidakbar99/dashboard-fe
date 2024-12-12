import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Layout from './components/layout';
import { ExpensesPage } from "./components/ExpensesPage";
import { IncomePage } from "./components/IncomePage";
import { ToastContainer } from 'react-toastify';
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
            <Route path="/income" element={<IncomePage />} />
            {/* <Route path="/projects" element={<Test />} /> */}
            {/* <Route path="/income" element={<Test />} /> */}
            <Route path="/expenses" element={<ExpensesPage />} />
            {/* <Route path="/employees" element={<EmployeesList />} /> */}
          </Routes>
          <ToastContainer />
        </Layout>
      </Router>
    </ApolloProvider>
  )
}

export default App
