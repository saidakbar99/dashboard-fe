import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query {
    getExpenseCategories{
      id
      name
      description
      expense_amount
      created_at
    }
  }
`;