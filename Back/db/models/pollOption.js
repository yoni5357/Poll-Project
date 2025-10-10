'use strict';
module.exports = (sequelize, DataTypes) => {
  const PollOption = sequelize.define('PollOption', {
    label: { type: DataTypes.STRING(255), allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'poll_options', underscored: true, timestamps: false });

  PollOption.associate = (models) => {
    PollOption.belongsTo(models.Poll, { as: 'poll', foreignKey: 'poll_id' });
  };
  return PollOption;
};
