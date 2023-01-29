const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      token: {
        type: DataTypes.STRING,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions');
  },
};
