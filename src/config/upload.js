const path = require('path')

const Multer = require('multer')

module.exports = {
  storage: new Multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(req, file, cb) {
      cb(null, file.originalname)
    },
  }),
}