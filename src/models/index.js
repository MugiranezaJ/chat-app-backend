const dbConfig = require("../config/db.config.js");
const mysql = require('mysql2/promise');

export async function initialize(){
  const Sequelize = require("sequelize");
  const { HOST, PORT, USER, PASSWORD, DB } = dbConfig;
  const connection = await mysql.createConnection({ host:HOST, port:PORT, user:USER, password:PASSWORD });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\`;`);
  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    logging: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });

  const db = {};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.test = require("./test.model.js")(sequelize, Sequelize);

  Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
  });
  return db;
}

// export default initialize;