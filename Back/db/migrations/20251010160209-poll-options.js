"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("poll_options", {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      poll_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "polls", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      label: { type: Sequelize.STRING(255), allowNull: false },
      position: { type: Sequelize.INTEGER, allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addConstraint("poll_options", {
      fields: ["poll_id", "position"],
      type: "unique",
      name: "poll_options_poll_position_uniq",
    });
  },
  async down(qi) {
    await qi.dropTable("poll_options");
  },
};
