import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
  mutation createExpenseCategory(
    $name: String!
    $description: String!
  ) {
    createExpenseCategory(
      name: $name
      description: $description
    ) {
      name
      description
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteExpenseCategory($id: String!) {
    deleteExpenseCategory(id: $id)
  }
`;