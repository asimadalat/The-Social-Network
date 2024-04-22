/**
 * A module defining a PostViews model using Sequelize.
 * @module models/PostViews
 * @author Asim
 */

/**
 * Export defines model to map table to database
 * @param {object} sequelize - Instance of node.js ORM library Sequelize
 * @param {object} DataTypes - Properties of Sequelize data types which map to SQL data types
 * @returns {object} - Sequelize model representing table 'PostViews'
 */
module.exports = (sequelize, DataTypes) => {
    const PostViews = sequelize.define("PostViews", {
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
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    }, {
      timestamps: false
    });
    
    return PostViews;
  };