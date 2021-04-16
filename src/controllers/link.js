const { Template, Link, LinkItem } = require("../../models/");
const Joi = require("joi");
const { Op } = require("sequelize");
const URL = process.env.URL;
const shortid = require("shortid");
const nanoid = require("nanoid");

exports.getLinks = async (req, res) => {
	try {
		const links = await Link.findAll({
			include: [
				{
					model: LinkItem,
					as: "links",
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
			],
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});
		res.send({
			status: "success",
			message: "Links Succesfully Get",
			data: {
				links,
				url: URL,
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
exports.getMyLinks = async (req, res) => {
	try {
		const links = await Link.findAll({
			where: {
				userId: req.userId.id,
			},
			include: [
				{
					model: LinkItem,
					as: "links",
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
			],
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
			order: [["id", "DESC"]],
		});
		res.send({
			status: "success",
			message: "Links Succesfully Get",
			data: {
				links,
				url: URL,
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
exports.getDetailLink = async (req, res) => {
	try {
		const { id } = req.params;
		const link = await Link.findOne({
			where: {
				id,
			},
			include: [
				{
					model: LinkItem,
					as: "links",
					attributes: {
						exclude: ["createdAt", "updatedAt", "userId"],
					},
				},
				{
					model: Template,
					as: "template",
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
			],
			attributes: {
				exclude: ["createdAt", "updatedAt", "restaurantId", "userId"],
			},
		});
		res.send({
			status: "success",
			message: "Link Succesfully Get",
			data: {
				link,
				url: URL,
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
exports.LinkView = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("param", id);
		const link = await Link.findOne({
			where: {
				uniqueLink: id,
			},
			include: [
				{
					model: LinkItem,
					as: "links",
					attributes: {
						exclude: ["createdAt", "updatedAt", "userId"],
					},
				},
				{
					model: Template,
					as: "template",
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
			],
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});
		if (!link) {
			return res.status(400).send({
				status: "error",
				message: "link doesn't exist",
			});
		}
		res.send({
			status: "success",
			message: "Link Succesfully Get",
			data: {
				link,
				url: URL,
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

exports.createLink = async (req, res) => {
	try {
		const { body } = req;

		const schema = Joi.object({
			title: Joi.string().required(),
			description: Joi.string().required(),
			// templateId: Joi.required(),
			image: Joi.required(),
			links: Joi.required(),
			template: Joi.required(),
		});
		const { error } = schema.validate(req.body);

		if (error)
			return res.status(400).send({
				status: "validation failed",
				message: error.details[0].message,
			});

		let uniqueLink = nanoid(8);
		const checklink = await Link.findOne({
			where: {
				uniqueLink,
			},
		});
		if (checklink) {
			uniqueLink = uniqueLink + nanoid(3);
		}

		const linkCreate = await Link.create({
			userId: req.userId.id,
			title: body.title,
			description: body.description,
			// templateId: body.templateId,
			image: body.image,
			uniqueLink,
		});

		const { links } = body;

		for (let i = 0; i < links.length; i++) {
			await LinkItem.create({
				linkId: linkCreate.id,
				title: links[i].title,
				url: links[i].url,
				image: links[i].image,
			});
		}
		const { template } = body;

		const templateCreate = await Template.create({
			linkId: linkCreate.id,
			button: template.button,
			background: template.background,
			imgstyle: template.imgstyle,
		});

		const link = await Link.findOne({
			where: {
				id: linkCreate.id,
			},
			include: [
				{
					model: LinkItem,
					as: "links",
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
				{
					model: Template,
					as: "template",
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
			],
			attributes: {
				exclude: ["createdAt", "updatedAt", "restaurantId", "userId"],
			},
		});

		res.send({
			status: "success",
			message: "Success Add New Link",
			data: {
				link,
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

exports.handleUpload = async (req, res) => {
	try {
		console.log("req-body", req.body);
		console.log("req-file", req.files);
		let imageName = null;
		if (!req.body.imageFile) {
			imageName = req.files.imageFile[0].filename;
		}

		res.send({
			status: "success",
			message: "Success upload Image",
			data: {
				imageName,
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

exports.deleteLink = async (req, res) => {
	try {
		const { id } = req.params;

		const link = await Link.findOne({
			where: {
				id,
			},
		});

		if (!link) {
			return res.status(400).send({
				status: "error",
				message: "link doesn't exist",
			});
		}

		await link.destroy();

		res.send({
			status: "success",
			message: "Link Succesfully Deleted",
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};

exports.creat = async (req, res) => {
	try {
		const { body } = req;

		console.log("req", req.body);

		const linkItem = [];
		for (let i = 0; i < body.links.length; i++) {
			const addimage = {
				...body.links[i],
				image: body.links[i].title,
			};

			linkItem.push(addimage);
		}

		// console.log("lig", linkItem);

		const schema = Joi.object({
			title: Joi.string().required(),
			description: Joi.string().required(),
			// templateId: Joi.required(),
			links: Joi.array(),
		});
		const { error } = schema.validate(req.body);

		if (error)
			return res.status(400).send({
				status: "validation failed",
				message: error.details[0].message,
			});

		let uniqueLink = nanoid(8);
		const checklink = await Link.findOne({
			where: {
				uniqueLink,
			},
		});
		if (checklink) {
			uniqueLink = uniqueLink + nanoid(3);
		}

		// const linkItem = [];
		// for (let i = 0; i < body.links.length; i++) {
		// 	const addimage = {
		// 		...body.links[i],
		// 		image: body.links[i].title,
		// 	};

		// 	linkItem.push(addimage);
		// }

		const linkCreate = await Link.create({
			userId: req.userId.id,
			title: body.title,
			description: body.description,
			// templateId: body.templateId,
			uniqueLink,
		});

		for (let i = 0; i < linkItem.length; i++) {
			await LinkItem.create({
				linkId: linkCreate.id,
				title: linkItem[i].title,
				url: linkItem[i].url,
				image: linkItem[i].image,
			});
		}
		// const order = await Order.bulkCreate(
		// 	orders.map((product) => ({
		// 		transactionId: transaction.id,
		// 		productId: product.id,
		// 		pricePurchased: product.price,
		// 		qty: product.qty,
		// 	}))
		// );

		const link = await Link.findOne({
			where: {
				id: linkCreate.id,
			},
			include: [
				{
					model: LinkItem,
					as: "links",
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
			],
			attributes: {
				exclude: ["createdAt", "updatedAt", "restaurantId", "userId"],
			},
		});

		res.send({
			status: "success",
			message: "Success Add New Link",
			data: {
				link,
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

exports.updateView = async (req, res) => {
	try {
		const { id } = req.params;

		const linkUpdate = await Link.findOne({
			where: {
				uniqueLink: id,
			},
		});

		if (!linkUpdate) {
			return res.status(400).send({
				status: "error",
				message: "link doesn't exist",
			});
		}
		linkUpdate.viewCount = linkUpdate.viewCount + 1;

		await linkUpdate.save();
		const link = await Link.findOne({
			where: {
				id: linkUpdate.id,
			},
		});
		res.send({
			status: "success",
			message: "viewCount Succesfully Updated",
			data: {
				link,
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
exports.updateLink = async (req, res) => {
	try {
		const { id } = req.params;

		console.log("req.body", req.body);
		const linkUpdate = await Link.findOne({
			where: {
				id,
			},
		});

		if (!linkUpdate) {
			return res.status(400).send({
				status: "error",
				message: "link doesn't exist",
			});
		}
		linkUpdate.title = req.body.title;
		linkUpdate.description = req.body.description;
		if (req.body.image == undefined) {
		} else {
			linkUpdate.image = req.body.image;
		}

		await linkUpdate.save();

		const link = await Link.findOne({
			where: {
				id,
			},
		});
		res.send({
			status: "success",
			message: " Succesfully Updated",
			data: {
				link,
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

exports.getLinkItem = async (req, res) => {
	try {
		const { id } = req.params;
		const linkitems = await LinkItem.findAll({
			where: {
				linkId: id,
			},
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
			order: [["ordered", "DESC"]],
		});
		res.send({
			status: "success",
			message: "LinkItem Succesfully Get",
			data: {
				linkitems,
				url: URL,
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

exports.updateItem = async (req, res) => {
	try {
		const { id } = req.params;

		console.log("req.body", req.body);
		const linkUpdate = await LinkItem.findOne({
			where: {
				id,
			},
		});

		if (!linkUpdate) {
			return res.status(400).send({
				status: "error",
				message: "link doesn't exist",
			});
		}
		if (req.body.image == undefined) {
		} else {
			linkUpdate.image = req.body.image;
		}
		linkUpdate.title = req.body.title;
		linkUpdate.description = req.body.description;

		await linkUpdate.save();

		const linkitem = await Link.findOne({
			where: {
				id,
			},
		});
		res.send({
			status: "success",
			message: " Succesfully Updated",
			data: {
				linkitem,
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
exports.createItem = async (req, res) => {
	try {
		const itemCreate = await LinkItem.create({
			linkId: req.body.linkId,
			title: req.body.title,
			url: req.body.url,
			image: req.body.image,
		});
		const linkitem = await LinkItem.findOne({
			where: {
				id: itemCreate.id,
			},

			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		res.send({
			status: "success",
			message: "LinkItem Succesfully Added",
			data: {
				linkitem,
				url: URL,
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
exports.deleteItem = async (req, res) => {
	try {
		const { id } = req.params;

		const link = await LinkItem.findOne({
			where: {
				id,
			},
		});

		if (!link) {
			return res.status(400).send({
				status: "error",
				message: "link doesn't exist",
			});
		}

		await link.destroy();

		res.send({
			status: "success",
			message: "Link Succesfully Deleted",
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};
