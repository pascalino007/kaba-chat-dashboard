import { gql } from '@apollo/client';
export const GETALLUSERS = gql`
query getAllUsers {
  users {
    id
    firstName
    lastName
    email
  }
}
`; 

export const GET_MSG = gql`
query MessagesByUser($receiverId: Int!) {
  messagesByUser(receiverId: $receiverId) {
    id
    receiverId
    senderId
    text
    createdAt
  }
}    
`;
