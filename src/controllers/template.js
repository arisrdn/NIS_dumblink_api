const { Template, Link } = require("../../models/");
const Joi = require("joi");
const URL = process.env.URL;
const nanoid = require("nanoid");

exports.getTemplate = async (req, res) => {
	try {
		const { id } = req.params;
		const template = await Template.findOne({
			where: {
				linkId: id,
			},
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});
		if (!template)
			return res.status(400).send({
				status: "Failed",
				message: "template notfound",
			});
		res.send({
			status: "success",
			message: "Template Succesfully Get",
			data: {
				links,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};

exports.createTemplate = async (req, res) => {
	try {
		const { body } = req;

		const templateCreate = await Template.create({
			linkId: body.linkId,
			button: body.button,
			background: body.background,
			imgstyle: body.imgstyle,
		});

		const template = await Link.findOne({
			where: {
				id: templateCreate.id,
			},
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		res.send({
			status: "success",
			message: "Success Add template",
			data: {
				template,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};

exports.updateButton = async (req, res) => {
	console.log("param", req.param);
	console.log("parsasaam", req.body);
	try {
		const { id } = req.params;
		const template = await Template.findOne({
			where: {
				id,
			},
		});
		if (!template)
			return res.status(400).send({
				status: "Failed",
				message: "template notfound",
			});
		template.button = req.body.button;

		await template.save();

		res.send({
			status: "success",
			message: "Update Succesfully ",
			data: {
				template,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};
exports.updateBg = async (req, res) => {
	try {
		const { id } = req.params;
		const template = await Template.findOne({
			where: {
				id,
			},
		});
		if (!template)
			return res.status(400).send({
				status: "Failed",
				message: "template notfound",
			});
		template.background = req.body.background;

		await template.save();

		res.send({
			status: "success",
			message: "Update Succesfully ",
			data: {
				template,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};
exports.updateImg = async (req, res) => {
	try {
		const { id } = req.params;
		const template = await Template.findOne({
			where: {
				id,
			},
		});
		if (!template)
			return res.status(400).send({
				status: "Failed",
				message: "template notfound",
			});
		template.imgstyle = req.body.imgstyle;

		await template.save();

		res.send({
			status: "success",
			message: "Update Succesfully ",
			data: {
				template,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};
