const multer = require('multer');

// Memory storage to store files in buffer
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed.'));
  }
};

// Multer configuration with error handling
const upload = multer({
  storage : storage,
  fileFilter : fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});



module.exports = upload;
