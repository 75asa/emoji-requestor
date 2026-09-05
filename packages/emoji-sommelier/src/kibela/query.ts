import gql from "graphql-tag";

export const emojiMutation = gql`
  mutation($code: String!, $url: String!) {
    createCustomEmoji(input: { emojiCode: $code, imageDataUrl: $url }) {
      clientMutationId
    }
  }
`;

export const emojiEdge = gql`
  query($id: ID!) {
    customEmojis(last: 10) {
      totalCount
      edges {
        node {
          id
          emojiCode
          imageUrl
          createdAt
        }
      }
    }
  }
`;
