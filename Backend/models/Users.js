/**
 * A module defining a Users model using Sequelize.
 * @module models/Users
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'Users'
 */
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'user',
      references: {
        model: 'Role', 
        key: 'name',
      }
    },
    firstName: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordSalt: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
    avatarURL: {
      type: DataTypes.STRING(64),
      allowNull: true,
    } 
  });

  return Users;

};