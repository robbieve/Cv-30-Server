'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Value = Sequelize.define('value', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'updated_at'
		}
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at'
	});
	Value.associate = models => {
		Value.belongsToMany(models.user, {
			through: 'user_values'
		});
		// Value.hasMany(models.valueText, { as: 'i18n', foreignKey: 'value_id' } );
	};
	return Value;
};