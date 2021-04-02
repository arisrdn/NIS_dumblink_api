// const multer = require("multer");

// exports.uploadFile = (imageFile, folder) => {
// 	//initialisasi multer diskstorage
// 	//menentukan destionation file diupload
// 	//menentukan nama file (rename agar tidak ada nama file ganda)
// 	path = "uploads/";
// 	const storage = multer.diskStorage({
// 		destination: function (req, file, cb) {
// 			cb(null, path); //lokasih penyimpan file
// 		},
// 		filename: function (req, file, cb) {
// 			cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")); //rename nama file by date now + nama tanpa space
// 		},
// 	});

// 	//function untuk filter file berdasarkan type
// 	const fileFilter = function (req, file, cb) {
// 		if (file.fieldname === imageFile) {
// 			if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
// 				req.fileValidationError = {
// 					message: "Only image files are allowed!",
// 				};
// 				return cb(new Error("Only image files are allowed!"), false);
// 			}
// 		}
// 		cb(null, true);
// 	};

// 	const sizeInMB = 100;
// 	const maxSize = sizeInMB * 1000 * 1000; //Maximum file size i MB

// 	//eksekusi upload multer dan tentukan disk storage, validation dan maxfile size
// 	const upload = multer({
// 		storage,
// 		fileFilter,
// 		limits: {
// 			fileSize: maxSize,
// 		},
// 	}).fields([
// 		{
// 			name: imageFile,
// 			maxCount: 1,
// 		},
// 	]); //fields digunakan karena file yang diupload lebih dari 1 fields

// 	//middleware handler
// 	return (req, res, next) => {
// 		// console.log("sasasasasasasasasa");
// 		upload(req, res, function (err) {
// 			//munculkan error jika validasi gagal
// 			if (req.fileValidationError)
// 				return res.status(400).send(req.fileValidationError);

// 			//munculkan error jika file tidak disediakan
// 			if (!req.files && !err)
// 				return res.status(400).send({
// 					message: "Please select files to upload",
// 				});

// 			//munculkan error jika melebihi max size
// 			if (err) {
// 				if (err.code === "LIMIT_FILE_SIZE") {
// 					return res.status(400).send({
// 						message: "Max file sized 10MB",
// 					});
// 				}
// 				return res.status(400).send(err);
// 			}

// 			//jika oke dan aman lanjut ke controller
// 			//akses nnti pake req.files
// 			return next();
// 		});
// 	};
// };

const multer = require("multer");

exports.uploadFile = (imageFile, folder) => {
	//initialisasi multer diskstorage
	//menentukan destionation file diupload
	//menentukan nama file (rename agar tidak ada nama file ganda)

	console.log("folder", folder);
	// switch (folder) {
	// 	case "profile":
	// 		path = "uploads/profile";
	// 		break;
	// 	case "product":
	// 		path = "uploads/product";
	// 		break;

	// 	default:
	// 		path = "uploads";
	// 		break;
	// }
	path = "uploads/";
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, path); //lokasih penyimpan file
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")); //rename nama file by date now + nama tanpa space
		},
	});

	//function untuk filter file berdasarkan type
	const fileFilter = function (req, file, cb) {
		if (file.fieldname === imageFile) {
			if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
				req.fileValidationError = {
					message: "Only image files are allowed!",
				};
				return cb(new Error("Only image files are allowed!"), false);
			}
		}
		cb(null, true);
	};

	const sizeInMB = 100;
	const maxSize = sizeInMB * 1000 * 1000; //Maximum file size i MB

	//eksekusi upload multer dan tentukan disk storage, validation dan maxfile size
	const upload = multer({
		storage,
		fileFilter,
		limits: {
			fileSize: maxSize,
		},
	}).fields([
		{
			name: imageFile,
			maxCount: 10,
		},
	]); //fields digunakan karena file yang diupload lebih dari 1 fields

	//middleware handler
	return (req, res, next) => {
		// console.log("sasasasasasasasasa");
		upload(req, res, function (err) {
			//munculkan error jika validasi gagal

			if (req.fileValidationError)
				return res.status(400).send(req.fileValidationError);

			//munculkan error jika file tidak disediakan
			if (!req.files && !err)
				return res.status(400).send({
					message: "Please select files to upload",
				});

			//munculkan error jika melebihi max size
			if (err) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.status(400).send({
						message: "Max file sized 10MB",
					});
				}
				return res.status(400).send(err);
			}

			// console.log("res", req.files);
			//jika oke dan aman lanjut ke controller
			//akses nnti pake req.files
			return next();
		});
	};
};
