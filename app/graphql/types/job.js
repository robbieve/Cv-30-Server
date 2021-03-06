module.exports = `
    type Job {
        id: String!
        name: String
        expireDate: Date
        phone: String
        email: String
        facebook: String
        linkedin: String
        createdAt: Date
        updatedAt: Date
        company: Company
        team: Team
        title: String
        description: String
        idealCandidate: String
        applicants: [Profile]
        location: String
        jobTypes: [JobType]
        salary: JobSalary
        activityField: ActivityField
        skills: [Skill]
        imagePath: String
        videoUrl: String
        status: String
        jobBenefits: [JobBenefit]
    }
    type JobType {
        id: Int
        title: String
    }
    type JobSalary {
        amountMin: Float
        amountMax: Float
        currency: Currency
        isPublic: Boolean
    }
    type JobBenefit {
        id: Int
        key: String!
    }

    input JobInput {
        id: String
        companyId: String
        teamId: String
        title: String
        description: String
        idealCandidate: String
        phone: String
        email: String
        facebook: String
        linkedin: String
        expireDate: Date
        location: String
        jobTypes: [Int]
        salary: JobSalaryInput
        activityField: String
        skills: [Int]
        imagePath: String
        videoUrl: String
        status: String
        jobBenefits: [Int]
    }
    input JobSalaryInput {
        amountMin: Float!
        amountMax: Float!
        currency: Currency!
        isPublic: Boolean!
    }

    type JobsConnection {
        edges: [JobEdge]!
        pageInfo: PageInfo!
    }

    type JobEdge {
        node: Job!
        cursor: String!
    }

    input JobCompensationFilterInput {
        amountMin: Float!
        amountMax: Float!
        currency: Currency!
    }

    input JobsFilterInput {
        companyId: String
        status: String
        title: String
        location: String
        companyName: String
        jobTypes: [Int]
        salary: JobCompensationFilterInput
        skills: [Int]
        benefits: [Int]
        teamId: String
        industryId: Int
        companyTypes: [Int]
    }

    extend type Query {
        jobs(
            language: LanguageCodeType!
            filter: JobsFilterInput
            first: Int!
            after: String
		): JobsConnection
		job(
			id: String!
			language: LanguageCodeType!
        ): Job
        jobTypes(
            language: LanguageCodeType!
        ): [JobType]
        jobBenefits: [JobBenefit]
    }

    extend type Mutation {
        handleJob (
			language: LanguageCodeType!
			jobDetails: JobInput!
		): StandardResponse
        handleApplyToJob (
			jobId: String!
			isApplying: Boolean!
		): StandardResponse
    }
`;

`type JobText {
    title: String
    description: String
    idealCandidate: String
}
type JobTypeText {
    title: String
}`;