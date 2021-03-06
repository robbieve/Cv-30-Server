const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        filter: yup.object().shape({
            companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            location: yup.string().trim().max(255),
            companyName: yup.string().trim().max(255),
            status: yup.string().required().matches(/(draft|active|archived)/, { excludeEmptyString: true }),
            jobTypes: yup.array().of(yup.number().positive().integer()),
            salary: yup.object().shape({
                amountMin: yup.number().positive().required().lessThan(yup.ref('amountMax')),
                amountMax: yup.number().positive().required(),
                currency: yup.string().required().matches(/(ron|eur)/, { excludeEmptyString: true })
            }).default(undefined),
            skills: yup.array().of(yup.number().positive().integer()),
            benefits: yup.array().of(yup.number().positive().integer()),
            teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            industryId: yup.number().positive().integer(),
            companyTypes: yup.array().of(yup.number().positive().integer())
        }),
        first: yup.number().positive().integer().moreThan(1).required(),
        after: yup.string().trim().matches(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/i).max(108).min(108)
    }),
    one: yup.object().shape({
        id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    jobTypes: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    input: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        jobDetails: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            idealCandidate: yup.string().trim(),
            phone: yup.string().trim().max(255).nullable(),
            email: yup.string().trim().max(255).nullable(),
            facebook: yup.string().trim().max(255).nullable(),
            linkedin: yup.string().trim().max(255).nullable(),
            expireDate: yup.date(),
            location: yup.string().trim().max(255),
            jobTypes: yup.array().of(yup.number().positive().integer()),
            salary: yup.object().shape({
                amountMin: yup.number().positive().required().lessThan(yup.ref('amountMax')),
                amountMax: yup.number().positive().required(),
                currency: yup.string().required().matches(/(ron|eur)/, { excludeEmptyString: true }),
                isPublic: yup.boolean().required()
            }).default(undefined),
            activityField: yup.string().trim().max(255),
            imagePath: yup.string().trim().max(1024).nullable(),
            videoUrl: yup.string().trim().max(1024).nullable(),
            skills: yup.array().of(
                yup.number().positive().integer()
            ),
            status: yup.string().matches(/(draft|active|archived)/, { excludeEmptyString: true }),
            jobBenefits: yup.array().of(yup.number().positive().integer()),
        })
    }),
    handleApplyToJob: yup.object().shape({
        jobId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        isApplying: yup.boolean().required()
    })
};