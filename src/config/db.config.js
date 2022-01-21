require('dotenv').config();

module.exports = {
    development:{
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      dialect: "mysql",
      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
    },
    production:{
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      dialect: "mysql",
      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
      },
    },
  }
}