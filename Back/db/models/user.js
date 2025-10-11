"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: "users",
      underscored: true, // matches created_at / updated_at
      timestamps: true, // uses created_at / updated_at with underscored
    }
  );

  return User;
};
