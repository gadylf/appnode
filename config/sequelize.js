const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('appnode', 'phpmyadmin', 'root', {
    host: 'localhost',
    dialect: 'mysql', // Utilisez 'mysql' pour MySQL, 'postgres' pour PostgreSQL, etc.
});

module.exports = sequelize;
