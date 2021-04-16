"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Link.belongsTo(models.User, {
				as: "user",
				foreignKey: {
					name: "userId",
				},
			});
			Link.hasMany(models.LinkItem, {
				foreignKey: "linkId",
				as: "links",
			});
			Link.hasOne(models.Template, {
				foreignKey: "linkId",
				as: "template",
			});
		}
	}
	Link.init(
		{
			title: DataTypes.STRING,
			// templateId: DataTypes.INTEGER,
			description: DataTypes.STRING,
			uniqueLink: DataTypes.STRING,
			image: DataTypes.STRING,
			viewCount: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Link",
		}
	);
	return Link;
};
