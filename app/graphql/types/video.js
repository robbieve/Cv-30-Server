module.exports = `
    type Video {
        id: String
        author: User
        title: String
        description: String
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
        originalFilename: String
        filename: String
        createdAt: Date
        updatedAt: Date
    }
    input VideoInput {
        id: String!
        title: String
        description: String
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
    }
`;

`type VideoText {
    title: String
    description: String
}`;