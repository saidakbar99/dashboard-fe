import { gql } from '@apollo/client';

export const CREATE_INCOME = gql`
  mutation CreateIncome(
    $amount: Float!
    $project: String!
    $income_date: DateTime!
    $description: String
  ) {
    createIncome(
      amount: $amount
      project: $project
      income_date: $income_date
      description: $description
    ) {
      amount
      description
      income_date
    }
  }
`;