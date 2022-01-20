import roles from '../utils/roles';

module.exports = function(sequelize, DataTypes){

    return sequelize.define("Users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        // tel: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     unique:true
        // },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false, 
            defaultValue: roles.USER
        },
        password:{
            type:DataTypes.STRING,
            allowNull: false
        },
        created_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: sequelize.fn('now')
        },
        updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		}
    },{
        tableName: 'Users',
        timestamps: false,
    });
    
    };