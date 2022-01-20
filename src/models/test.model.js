module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Test', {
		id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		}
	}, {
		tableName: 'Test',
		timestamps: false,
	});
};