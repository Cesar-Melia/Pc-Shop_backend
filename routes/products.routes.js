const express = require('express');
const {
  productsGet,
  createPost,
  editPut,
  deleteProduct,
  productIdGet,
} = require('../controllers/products.controller');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware');
const { isAdmin } = require('../middlewares/auth.middleware');

router.get('/', productsGet);

router.post('/create', [isAdmin, upload.single('image'), uploadToCloudinary], createPost);

router.put('/edit/:id', [isAdmin, upload.single('image'), uploadToCloudinary], editPut);

router.delete('/:_id', isAdmin, deleteProduct);

router.get('/:id', productIdGet);

module.exports = router;
