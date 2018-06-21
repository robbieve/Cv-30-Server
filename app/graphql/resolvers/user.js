
const profile = (id, language, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length)
        throw new Error(errors);
    let profile = user.profile ? user.profile.get() : {};
    let result = {
        ...user.get(),
        ...profile,
        featuredArticles: user.getArticles(),
        skills: user.getSkills(),
        values: user.getValues(),
        experience: user.getExperiences(),
        projects: user.getProjects(),
        contacts: user.getContact()
    };

    return result;
}

const setAvatar = (status, { user, models }) => {
    const errors = [];

    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) throw new Error(errors);
    if (models.profile.upsert({ userId: user.id, hasAvatar: status })) {
        return {
            status: true,
            error: ""
        };
    } else {
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const setHasProfileCover = (status, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) throw new Error(errors);
    if (models.profile.upsert({ userId: user.id, hasProfileCover: status })) {
        return {
            status: true,
            error: ""
        };
    } else {
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const setCoverBackground = (color, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }

    if (errors.length) throw new Error(errors);

    if (models.profile.upsert({ userId: user.id, coverBackground: color })) {
        return {
            status: true,
            error: ""
        };
    } else {
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

module.exports = {
    profile,
    setAvatar,
    setHasProfileCover,
    setCoverBackground
};