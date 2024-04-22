/**
 * A module defining a Logs model using Sequelize.
 * @module models/Logs
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'Logs'
 */
module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define("Logs", {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      timestamp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      logData: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    });
    return Logs;
  };