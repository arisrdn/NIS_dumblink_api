const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const URL = process.env.URL;

exports.login = async (req, res) => {
	try {
		console.log(".isi", req.body);
		const { email, password } = req.body;

		// console.log(req);
		//   validasi
		const schema = Joi.object({
			email: Joi.string().email().min(10).max(50).required(),
			password: Joi.string().min(8).required(),
		});

		//   mengambil eror dari joi
		const { error } = schema.validate(req.body);

		//   cek jika ada error
		if (error)
			return res.status(400).send({
				status: "validation failed",
				message: error.details[0].message,
			});

		// chek email di database
		const checkEmail = await User.findOne({
			where: {
				email,
			},
		});

		if (!checkEmail)
			return res.status(400).send({
				status: "Login Failed",
				message: "Your Credentials is not Valid",
			});

		// bcryp password
		const isValidPass = await bcrypt.compare(password, checkEmail.password);

		if (!isValidPass) {
			return res.status(400).send({
				status: "Login Failed",
				message: "Your Credentials is not Valid",
			});
		}

		//   konfigurasi token
		const secretKey = process.env.SECRET_KEY;
		//   ubah id jadi token
		const token = jwt.sign(
			{
				id: checkEmail.id,
			},
			secretKey
		);
		// console.log(token);

		const userdata = await User.findOne({
			where: {
				id: checkEmail.id,
			},
			// include: [
			// 	{
			// 		model: Restaurant,
			// 		as: "restaurant",
			// 		attributes: {
			// 			exclude: ["createdAt", "updatedAt", "userId"],
			// 		},
			// 	},
			// ],
			attributes: {
				exclude: ["createdAt", "updatedAt", "password", "id"],
			},
		});
		const userarray = JSON.stringify(userdata);
		const user = JSON.parse(userarray);
		user.token = token;
		// user.image = URL + user.image;
		// console.log("token", user, "sasasa", user.token);

		res.status(200).send({
			status: "success",
			message: "Login Success",
			data: {
				user,
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

exports.register = async (req, res) => {
	try {
		const { email, password } = req.body;
		const schema = Joi.object({
			email: Joi.string().email().min(10).max(50).required(),
			password: Joi.string().min(8).required(),
			fullName: Joi.string().required(),
		});

		const { error } = schema.validate(req.body);

		if (error)
			return res.status(400).send({
				status: "validation failed",
				message: error.details[0].message,
			});

		const checkEmail = await User.findOne({
			where: {
				email,
			},
		});
		if (checkEmail)
			return res.status(400).send({
				status: "Register failed",
				message: "Email already registered",
			});

		const hashStrength = parseInt(process.env.PASSWORD_STRENGTH);
		const hashedPassword = await bcrypt.hash(password, hashStrength);

		const userCreate = await User.create({
			...req.body,
			password: hashedPassword,
		});

		const secretKey = process.env.SECRET_KEY;

		const token = jwt.sign(
			{
				id: userCreate.id,
			},
			secretKey
		);
		const userdata = await User.findOne({
			where: {
				id: userCreate.id,
			},
			// include: [
			// 	{
			// 		model: Restaurant,
			// 		as: "restaurant",
			// 		attributes: {
			// 			exclude: ["createdAt", "updatedAt", "userId"],
			// 		},
			// 	},
			// ],
			attributes: {
				exclude: ["createdAt", "updatedAt", "password", "id"],
			},
		});
		const userarray = JSON.stringify(userdata);
		const user = JSON.parse(userarray);
		user.token = token;
		// user.image = URL + user.image;

		res.send({
			status: "success",
			message: "User Succesfully Registered",
			data: {
				user,
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

exports.checkAuth = async (req, res) => {
	try {
		// console.log("userid", req.userId.id);
		const user = await User.findOne({
			where: {
				id: req.userId.id,
			},
			// include: [
			// 	{
			// 		model: Restaurant,
			// 		as: "restaurant",
			// 		attributes: {
			// 			exclude: ["createdAt", "updatedAt", "userId"],
			// 		},
			// 	},
			// ],
			attributes: {
				exclude: ["createdAt", "updatedAt", "password", "gender", "id"],
			},
		});

		if (!user)
			return res.status(400).send({
				status: "Auth failed",
				message: "user not exist",
			});

		res.send({
			status: "success",
			message: "User Valid",
			data: {
				user,
				url: URL,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			message: "Server Error",
		});
	}
};
