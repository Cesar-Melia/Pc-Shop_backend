const User = require('../models/User.model');

const usersGet = async (req, res, next) => {
  try {
    let isAdmin;
    if (req.user && req.user.role === 'admin') {
      isAdmin = true;
    }

    const users = await User.find().populate('orders');
    return res.status(200).render('users', { user: req.user, users, isAdmin });
  } catch (error) {
    return next(error);
  }
};

const editPut = async (req, res, next) => {
  try {
    const { _id, name, lastName, email, password, adress, country, city, orders, cart, role } =
      req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (lastName) fieldsToUpdate.lastName = lastName;
    if (email) fieldsToUpdate.email = email;
    if (password) fieldsToUpdate.password = password;
    if (adress) fieldsToUpdate.adress = adress;
    if (country) fieldsToUpdate.country = country;
    if (country) fieldsToUpdate.name = name;
    if (city) fieldsToUpdate.city = city;
    if (orders) fieldsToUpdate.orders = orders;
    if (cart) fieldsToUpdate.cart = cart;
    if (role) fieldsToUpdate.role = role;

    const updatedUser = await User.findByIdAndUpdate(_id, fieldsToUpdate, { new: true });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};

const userDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    let response = '';

    const deleted = await User.findByIdAndDelete(id);

    if (deleted) response = 'User deleted from db';
    else response = "Can't find a User whit this id";

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const userIdGet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDetail = await User.findById(id);

    return res.status(200).render('user', { user: req.user, userDetail, isAdmin: req.isAdmin });
  } catch (error) {
    return next(error);
  }
};

module.exports = { usersGet, editPut, userDelete, userIdGet };
