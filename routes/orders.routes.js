const express = require('express');
const { isAdmin } = require('../middlewares/auth.middleware');
const {
  ordersGet,
  createOrderPost,
  addProductPut,
  editPut,
  orderDelete,
  orderIdGet,
} = require('../controllers/orders.controller');

const router = express.Router();

router.get('/', isAdmin, ordersGet);

router.post('/create', createOrderPost);

router.put('/add-product', isAdmin, addProductPut);

router.put('/edit', isAdmin, editPut);

router.delete('/:id', isAdmin, orderDelete);

router.get('/:id', orderIdGet);

module.exports = router;
