const Image = `
    type Image {
        id: String
        author: User
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
        originalFilename: String
        filename: String
        i18n: [ImageText]
        createdAt: Date
        updatedAt: Date
    }
    type ImageText {
        title: String
        description: String
    }
    input ImageInput {
        id: String!
        title: String
        description: String
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
    }

    extend type Query {
        images: [Image]
    }
`;

module.exports = () => [Image];