const express = require('express');
const {
  productsGet,
  shopGet,
  createGet,
  createPost,
  editPut,
  editGet,
  deleteGet,
  deleteProduct,
  productIdGet,
} = require('../controllers/products.controller');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware');
const { isAdmin, isAuth } = require('../middlewares/auth.middleware');

router.get('/', isAdmin, productsGet);

router.get('/shop', shopGet);

router.get('/create', isAdmin, createGet);

router.post('/create', [isAdmin, upload.single('image'), uploadToCloudinary], createPost);

router.get('/edit', isAdmin, editGet);

router.put('/edit/:id', [isAdmin, upload.single('image'), uploadToCloudinary], editPut);

router.get('/delete', isAdmin, deleteGet);

router.delete('/:_id', isAdmin, deleteProduct);

router.get('/:id', productIdGet);

module.exports = router;
