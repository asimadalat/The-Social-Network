/**
 * A module defining a Comments model using Sequelize.
 * @module models/Comments
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'Comments'
 */
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    allText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'ID',
      }
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'ID', 
      }
    },
    imageURL: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
  });
    
  return Comments;
    
};