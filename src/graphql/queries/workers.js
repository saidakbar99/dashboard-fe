import { gql } from '@apollo/client';

export const GET_WORKERS = gql`
  query {
    getWorkers{
      id
      name
      role
      salary
      created_at
    }
  }
`;