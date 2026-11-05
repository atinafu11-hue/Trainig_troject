const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const fileFilter = (_, file, cb) => {
  const ok = /jpeg|jpg|png|webp/;
  const pass =
    ok.test(path.extname(file.originalname).toLowerCase()) &&
    ok.test(file.mimetype);
  cb(pass ? null : new Error('Only image files allowed'), pass);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});