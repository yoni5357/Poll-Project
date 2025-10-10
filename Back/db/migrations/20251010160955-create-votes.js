"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("votes", {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      poll_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "polls", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      option_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "poll_options", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      voter_username: { type: Sequelize.STRING(100), allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("votes", ["option_id"]);
    await queryInterface.addConstraint("votes", {
      fields: ["poll_id", "voter_username"],
      type: "unique",
      name: "votes_poll_username_uniq",
    });
  },
  async down(qi) {
    await qi.dropTable("votes");
  },
};
