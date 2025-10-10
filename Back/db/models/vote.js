'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    voter_username: { type: DataTypes.STRING(100), allowNull: false }
  }, { tableName: 'votes', underscored: true, timestamps: false });

  Vote.associate = (models) => {
    Vote.belongsTo(models.Poll, { as: 'poll', foreignKey: 'poll_id' });
    Vote.belongsTo(models.PollOption, { as: 'option', foreignKey: 'option_id' });
  };
  return Vote;
};
