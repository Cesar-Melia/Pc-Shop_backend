const express = require('express');
const {
  cartsGet,
  cartUserGet,
  addToCartPost,
  createPost,
  cartDelete,
  editPut,
  addProductPut,
} = require('../controllers/cart.controllers');
const router = express.Router();
const { isAdmin, isAuth } = require('../middlewares/auth.middleware');

router.get('/', isAdmin, cartsGet);

router.get('/user', isAuth, cartUserGet);

router.post('/add-to-cart/:id', isAuth, addToCartPost);

router.post('/create', isAdmin, createPost);

router.put('/edit', isAdmin, editPut);

router.delete('/:id', isAdmin, cartDelete);

module.exports = router;
