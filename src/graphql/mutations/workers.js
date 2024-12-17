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

export const DELETE_WORKER = gql`
  mutation DeleteWorker($id: String!) {
    deleteWorker(id: $id)
  }
`;