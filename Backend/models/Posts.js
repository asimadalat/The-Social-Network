/**
 * A module defining a Posts model using Sequelize.
 * @module models/Posts
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'Posts'
 */
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bodyText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'ID',
      }
    }
  });
  
    return Posts;
  
};