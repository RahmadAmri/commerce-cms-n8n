"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, defaultValue: "" },
      price: { type: Sequelize.INTEGER, allowNull: false },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      image: { type: Sequelize.STRING, defaultValue: "" },
      category: { type: Sequelize.STRING, defaultValue: "Umum" },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("Orders", {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      reference: { type: Sequelize.STRING, allowNull: false, unique: true },
      customerName: { type: Sequelize.STRING, allowNull: false },
      customerEmail: { type: Sequelize.STRING, allowNull: false },
      customerPhone: { type: Sequelize.STRING, allowNull: false },
      items: { type: Sequelize.JSONB, allowNull: false },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.STRING, defaultValue: "UNPAID" },
      paymentMethod: { type: Sequelize.STRING, defaultValue: "Tripay" },
      checkoutUrl: { type: Sequelize.TEXT, defaultValue: "" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Orders");
    await queryInterface.dropTable("Products");
  },
};
