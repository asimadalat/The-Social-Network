/**
 * A module defining a Roles model using Sequelize.
 * @module models/Roles
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'Roles'
 */
module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define("Roles", {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(32),
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
    });
  
    return Roles;
  
  };