const express = require("express");

const router = express.Router();
const { authenticated } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadimage");
const { pass } = require("../middlewares/passdata");

const { register, login, checkAuth } = require("../controllers/auth");
const {
	getDetailUser,
	updateUser,
	deleteUser,
} = require("../controllers/user");
const {
	createTemplate,
	getTemplate,
	updateBg,
	updateButton,
	updateImg,
} = require("../controllers/template");
const {
	createLink,
	getLinks,
	getMyLinks,
	getDetailLink,
	LinkView,
	handleUpload,
	deleteLink,
	updateView,
	updateLink,
	getLinkItem,
	updateItem,
	createItem,
	deleteItem,
} = require("../controllers/link");

// link
// Auth
router.post("/login", login);
router.post("/register", register);
router.get("/check-auth", authenticated, checkAuth);
router.get("/user", authenticated, getDetailUser);
router.patch("/user/edit", authenticated, updateUser);
router.delete("/user", authenticated, deleteUser);

// link unique
router.get("/uniquelink/:id", LinkView);
router.put("/link/:id", updateView);
// link
router.post("/link", authenticated, createLink);
router.get("/links/", authenticated, getLinks);
router.get("/link/", authenticated, getMyLinks);
router.get("/link/:id", authenticated, getDetailLink);
router.patch("/link/:id", authenticated, updateLink);
router.delete("/link/:id", authenticated, deleteLink);
router.post(
	"/upload",
	authenticated,
	uploadFile("imageFile", "profile"),
	handleUpload
);
// ??itemLink
router.get("/items/:id", authenticated, getLinkItem);
router.patch("/item/:id", authenticated, updateItem);
router.post("/item", authenticated, createItem);
router.delete("/item/:id", authenticated, deleteItem);

router.post("/template", authenticated, createTemplate);
router.get("/template/:id", authenticated, getTemplate);

router.put("/button/:id", updateButton);
router.put("/imgstyle/:id", updateImg);
router.put("/bg/:id", updateBg);

module.exports = router;
