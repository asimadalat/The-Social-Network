/**
 * A module defining a Replies model using Sequelize.
 * @module models/Replies
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'Replies'
 */
module.exports = (sequelize, DataTypes) => {
    const Replies = sequelize.define("Replies", {
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
      commentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Comment',
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
      }
    });
      
    return Replies;
      
  };