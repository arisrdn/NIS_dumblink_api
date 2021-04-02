const multer = require("multer");

//eksekusi upload multer dan tentukan disk storage, validation dan maxfile size
const upload = multer({}); //fields digunakan karena file yang diupload lebih dari 1 fields

//middleware handler
return (req, res, next) => {
	console.log("sasasasasasasasasa");
	upload(req, res, function (err) {
		return next();
	});
};
