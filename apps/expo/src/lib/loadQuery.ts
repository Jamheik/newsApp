import { gql } from "@apollo/client";

const LOAD_QUERY = gql`
  query Query {
  categories
  articles(page: 1) {
    total
    pageSize
    page
    articles {
        id
        categories
        image
        title
        iso_date
      }
  }
}
`