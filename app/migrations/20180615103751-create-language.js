'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('languages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			code: {
				allowNull: false,
				type: Sequelize.STRING(10)
			},
			label: {
				allowNull: false,
				type: Sequelize.STRING(50)
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'created_at'
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at'
			}
		}, {
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		})
		.then(() => queryInterface.addIndex('languages', { unique: true, fields: ['code'] }))
		.then(() => queryInterface.bulkInsert('languages', [
			{
				code: "en",
				label: "English",
				created_at: new Date(),
				updated_at: new Date()
			}, {
				code: "ro",
				label: "Română",
				created_at: new Date(),
				updated_at: new Date()
			},
		]));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('languages');
	}
};