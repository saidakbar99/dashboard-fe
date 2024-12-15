import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
query {
  getProjects{
    id
    name
    description
    income_amount
    created_at
  }
}
`;