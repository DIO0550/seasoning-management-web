// Placeholder for GraphQL schema
export const typeDefs = /* GraphQL */ `
  type Seasoning {
    id: ID!
    name: String!
    quantity: Float
    unit: String
    expirationDate: String
    notes: String
  }

  type Template {
    id: ID!
    name: String!
    seasonings: [Seasoning!]!
    description: String
  }

  type Query {
    seasonings: [Seasoning!]!
    seasoning(id: ID!): Seasoning
    templates: [Template!]!
    template(id: ID!): Template
  }

  type Mutation {
    createSeasoning(name: String!, quantity: Float, unit: String, expirationDate: String, notes: String): Seasoning!
    updateSeasoning(id: ID!, name: String, quantity: Float, unit: String, expirationDate: String, notes: String): Seasoning!
    deleteSeasoning(id: ID!): Boolean!

    createTemplate(name: String!, description: String, seasoningIds: [ID!]): Template!
    updateTemplate(id: ID!, name: String, description: String, seasoningIds: [ID!]): Template!
    deleteTemplate(id: ID!): Boolean!
  }
`;