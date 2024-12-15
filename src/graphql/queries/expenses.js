import { gql } from '@apollo/client';

export const GET_EXPENSES = gql`
  query {
    getExpenses {
      id
      amount
      description
      expense_date
      created_at
      category {
        id
        name
      }
      worker {
        id
        name
      }
      project {
        id
        name
      }
    }
    getProjects {
      id
      name
    }
    getWorkers {
      id
      name
    }
    getExpenseCategories{
      id
      name
    }
  }
`;