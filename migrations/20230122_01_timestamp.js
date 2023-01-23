const { DataTypes, fn } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'created_at', {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    });
    await queryInterface.addColumn('blogs', 'updated_at', {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    });
    await queryInterface.addColumn('users', 'created_at', {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    });
    await queryInterface.addColumn('users', 'updated_at', {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'created_at');
    await queryInterface.removeColumn('blogs', 'updated_at');
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updated_at');
  },
};
