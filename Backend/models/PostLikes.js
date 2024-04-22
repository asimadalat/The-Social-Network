/**
 * A module defining a PostLikes model using Sequelize.
 * @module models/PostLikes
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'PostLikes'
 */
module.exports = (sequelize, DataTypes) => {
    const PostLikes = sequelize.define("PostLikes", {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      postID: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      }
    }, {
      timestamps: false
    });
    return PostLikes;
  };