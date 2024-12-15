import { gql } from '@apollo/client';

export const CREATE_WORKER = gql`
mutation CreateWorker(
  $salary: Float!
  $name: String!
  $role: String!
) {
  createWorker(
    salary: $salary
    name: $name
    role: $role
  ) {
    salary
    name
    role
  }
}
`;