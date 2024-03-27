const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    // Définir les colonnes de la table User
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le prénom est requis"
            },
            notEmpty: {
                msg: "Le prénom ne peut pas être vide"
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le nom de famille est requis"
            },
            notEmpty: {
                msg: "Le nom de famille ne peut pas être vide"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le mot de passe est requis"
            },
            notEmpty: {
                msg: "Le mot de passe ne peut pas être vide"
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "L'adresse e-mail est requise"
            },
            notEmpty: {
                msg: "L'adresse e-mail ne peut pas être vide"
            },
            isEmail: {
                msg: "L'adresse e-mail doit être valide"
            }
        }
    }
});

module.exports = User;