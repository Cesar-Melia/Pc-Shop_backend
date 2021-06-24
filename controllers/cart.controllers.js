const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

const cartsGet = async (req, res, next) => {
  try {
    let cart = await Cart.find().populate('user').populate('products.product');

    return res.status(200).json(cart);
  } catch (error) {
    return next(error);
  }
};

const cartUserGet = async (req, res, next) => {
  try {
    const existingCart = await Cart.findOne({ user: req.user._id })
      .populate('user')
      .populate('products.product');

    if (existingCart) {
      existingCart.user.password = null;
    }

    return res.render('cesta', { user: req.user, isAdmin: req.isAdmin, cart: existingCart });
  } catch (error) {
    next(error);
  }
};

const addToCartPost = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;
  const product = await Product.findById(productId);

  const existingCart = await Cart.findOne({ user: userId }).populate('user');

  if (!existingCart) {
    const newCart = new Cart({
      user: userId,
      products: [
        {
          product: productId,
          quantity: 1,
          price: product.price,
        },
      ],
      totalPrice: product.price,
      totalQuantity: 1,
    });

    await newCart.save();

    console.log(newCart);
  } else {
    const hasProduct = existingCart.products.some((prod) => prod.product.equals(productId));

    if (!hasProduct) {
      const editedCart = await Cart.findByIdAndUpdate(
        existingCart._id,
        {
          $addToSet: {
            products: {
              product: productId, ////
              quantity: 1,
              price: product.price,
            },
          },
          $inc: {
            totalPrice: product.price,
            totalQuantity: 1,
          },
        },
        { new: true }
      )
        .populate('user')
        .populate('products.product');

      return res.redirect('/products/shop');
    } else {
      const newProducts = existingCart.products.map((prod) => {
        if (prod.product.equals(productId)) {
          prod.quantity = prod.quantity + 1;
        }

        return prod;
      });

      const editedProduct = await Cart.findByIdAndUpdate(
        existingCart._id,
        {
          $set: {
            products: newProducts,
          },
          $inc: {
            totalPrice: product.price,
            totalQuantity: 1,
          },
        },
        { new: true }
      );

      console.log(editedProduct);
    }
  }
  console.log(existingCart);
  return res.redirect('/products/shop');
};

const createPost = async (req, res, next) => {
  try {
    const { user, products, totalPrice, totalQuantity } = req.body;

    const newCart = new Cart({
      user,
      products,
      totalPrice,
      totalQuantity,
    });

    const createdCart = await newCart.save();

    return res.status(201).json(createdCart);
  } catch (error) {
    return next(error);
  }
};

const cartDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    let response = '';

    let deleted = await Cart.findByIdAndDelete(id);

    if (deleted) response = 'Cart deleted from db';
    else response = "Can't find a cart whit this id";

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const editPut = async (req, res, next) => {
  try {
    const { _id, user, products, total } = req.body;

    console.log(req.body);

    const fieldsToUpdate = {};
    if (user) fieldsToUpdate.user = user;
    if (products) fieldsToUpdate.products = products;
    if (total) fieldsToUpdate.total = total;

    const updatedCart = await Cart.findByIdAndUpdate(_id, fieldsToUpdate, { new: true });

    return res.status(200).json(updatedCart);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  cartsGet,
  cartUserGet,
  addToCartPost,
  createPost,
  editPut,
  cartDelete,
};
