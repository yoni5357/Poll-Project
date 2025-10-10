'use strict';
module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
    slug: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    creator_username: { type: DataTypes.STRING(100), allowNull: false },
  }, { tableName: 'polls', underscored: true, timestamps: true });

  Poll.associate = (models) => {
    Poll.hasMany(models.PollOption, { as: 'options', foreignKey: 'poll_id', onDelete: 'CASCADE' });
  };
  return Poll;
};
