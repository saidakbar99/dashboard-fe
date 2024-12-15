import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
mutation CreateProject(
  $name: String!
  $description: String!
) {
  createProject(
    name: $name
    description: $description
  ) {
    name
    description
  }
}
`;