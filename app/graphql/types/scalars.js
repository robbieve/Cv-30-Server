module.exports = `
    scalar Date
    enum Currency {
        eur
        ron
    }
    enum VideoTarget {
        article
        profile_cover
        company_cover
    }
    enum ImageTarget {
        article
        profile
        profile_cover
        company_cover
    }
    enum LanguageCodeType {
        en
        ro
    }
    enum UserStatus {
        active
        pending
        suspended
        deleted
    }
    enum ContactType {
        phone
        email
    }
    enum ImageType {
        jpeg
        png
    }
    enum SocialType {
        url
        facebook
        twitter
        instagram
    }
    enum TextLocationType {
        front
        back
    }
`;