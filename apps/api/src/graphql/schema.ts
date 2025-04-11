export const typeDefs = `#graphql
  type Feed {
    id: ID!
    feed_url: String!
    feed_name: String
  }

  type Article {
    id: ID!
    feed_id: ID!
    unique_id: String
    title: String!
    link: String!
    pub_date: String
    iso_date: String
    content: String
    image: String
    categories: [String]
    version: Int
  }

  type ArticleContext {
    id: ID!
    article_id: ID!
    language_code: String!
    title: String!
    full_text: String!
    version: Int!
    created_at: String!
  }

  type ArticleAttachment {
    id: ID!
    article_id: ID!
    attachment_type: String!
    attachment_url: String!
    local_path: String
    created_at: String!
  }

  type ArticleDetail {
    article: Article!
    context: ArticleContext
  }

  type ArticlesResponse {
    articles: [Article!]!
    page: Int!
    pageSize: Int!
    total: Int!
  }

  type WeatherCondition {
    main: String!
    description: String!
    icon: String
  }

  type Weather {
    location: String!
    country: String!
    temperature: Float!
    feels_like: Float
    humidity: Int
    wind_speed: Float
    conditions: [WeatherCondition!]!
    timestamp: String!
  }

  type CategoryList {
    label: String!
    values: [String!]!
  }

  type Query {
    feeds: [Feed!]!
    articles(page: Int, pageSize: Int, categories: [String!], version: Int): ArticlesResponse!
    article(id: ID!, version: Int): ArticleDetail
    weather(location: String, latitude: Float, longitude: Float): Weather
    categories(label: String): [CategoryList!]!
  }
`;
