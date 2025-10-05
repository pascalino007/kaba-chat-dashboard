import { gql } from '@apollo/client';
export const MSG_SUB = gql`
  subscription Subscription($receiverId: Int!) {
  messageSent(receiverId: $receiverId) {
    text
    senderId
    receiverId
    id
    createdAt
  }
}
`


