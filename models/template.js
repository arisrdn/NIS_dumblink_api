"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Template extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Template.belongsTo(models.Link, {
				as: "link",
				foreignKey: {
					name: "linkId",
				},
			});
		}
	}
	Template.init(
		{
			button: DataTypes.STRING,
			background: DataTypes.STRING,
			imgstyle: DataTypes.STRING,
			linkId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Template",
		}
	);
	return Template;
};
