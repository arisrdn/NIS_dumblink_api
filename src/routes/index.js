const express = require("express");

const router = express.Router();
const { authenticated } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadimage");
const { pass } = require("../middlewares/passdata");

// user
const { register, login, checkAuth } = require("../controllers/auth");
// const { register, login, checkAuth } = require("../controllers/auth");
const {
	createLink,
	getLinks,
	getMyLinks,
	getDetailLink,
	LinkView,

	handleUpload,
} = require("../controllers/link");

// link
// Auth
router.post("/login", login);
router.post("/register", register);
router.get("/check-auth", authenticated, checkAuth);

router.post("/link", authenticated, createLink);
router.post(
	"/upload",
	authenticated,
	uploadFile("imageFile", "profile"),
	handleUpload
);
// router.post("/link", authenticated, createLink);
// router.post("/link", authenticated, createLink);
router.get("/uniquelink/:id", LinkView);

module.exports = router;
