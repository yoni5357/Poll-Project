'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('polls', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      slug: { type: Sequelize.STRING(32), allowNull: false, unique: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      creator_username: { type: Sequelize.STRING(100), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('polls'); }
};