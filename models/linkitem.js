"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class LinkItem extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			LinkItem.belongsTo(models.Link, {
				as: "links",
				foreignKey: {
					name: "linkId",
				},
			});
		}
	}
	LinkItem.init(
		{
			title: DataTypes.STRING,
			url: DataTypes.STRING,
			image: DataTypes.STRING,
			linkId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "LinkItem",
		}
	);
	return LinkItem;
};
