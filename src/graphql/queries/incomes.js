import { gql } from '@apollo/client';

export const GET_INCOMES = gql`
  query {
    getIncomes{
      id
      amount
      description
      project{
        name
      }
      created_at
      income_date
    }
    getProjects {
      id
      name
    }
  }
`;