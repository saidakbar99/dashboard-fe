import { gql } from '@apollo/client';

export const CREATE_EXPENSE = gql`
  mutation CreateExpense(
    $amount: Float!
    $category: String!
    $expense_date: DateTime!
    $description: String
    $worker: String
    $project: String
  ) {
    createExpense(
      amount: $amount
      category: $category
      expense_date: $expense_date
      description: $description
      worker: $worker
      project: $project
    ) {
      id
      amount
      description
      expense_date
    }
  }
`;

export const UPDATE_EXPENSE = gql`
  mutation UpdateExpense(
    $id: String!
    $amount: Float
    $description: String
    $category: String
    $worker: String
    $project: String
    $expense_date: DateTime
  ) {
    updateExpense(
      id: $id
      amount: $amount
      description: $description
      category: $category
      worker: $worker
      project: $project
      expense_date: $expense_date
    ) {
      id
      amount
      description
      expense_date
      category {
        name
      }
      worker {
        name
      }
      project {
        name
      }
    }
  }
`;