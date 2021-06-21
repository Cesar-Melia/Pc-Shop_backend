const Order = require("../models/Order.model");
const User = require("../models/User.model");

const ordersGet = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("users").populate("products");

        return res.status(200).render("orders", { user: req.user, orders, isAdmin: req.isAdmin });
    } catch (error) {
        return next(error);
    }
};

const createOrderPost = async (req, res, next) => {
    try {
        const { user, products, adress, isPaid } = req.body;

        const date = Date.now();

        const newOrder = new Order({ user, products, date, adress, isPaid });

        const createdOrder = await newOrder.save();

        await User.findByIdAndUpdate(
            user,
            {
                $addToSet: { orders: createdOrder._id },
            },
            { new: true }
        );

        console.log(createdOrder);

        return res.status(200).json(createdOrder);
    } catch (error) {
        next(error);
    }
};

const addProductPut = async (req, res, next) => {
    try {
        const { productId, orderId } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $addToSet: { products: productId },
            },
            { new: true }
        );

        return res.status(200).json(updatedOrder);
    } catch (error) {
        return next(error);
    }
};

const editPut = async (req, res, next) => {
    try {
        const { _id, user, products, date, adress, isPaid } = req.body;

        const fieldsToUpdate = {};
        if (user) fieldsToUpdate.user = user;
        if (products) fieldsToUpdate.products = products;
        if (date) fieldsToUpdate.date = date;
        if (adress) fieldsToUpdate.adress = adress;
        if (isPaid) fieldsToUpdate.isPaid = isPaid;

        const updatedOrder = await Order.findByIdAndUpdate(_id, fieldsToUpdate, { new: true });

        return res.status(200).json(updatedOrder);
    } catch (error) {
        return next(error);
    }
};
const orderDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        let response = "";

        const deleted = await Order.findByIdAndDelete(id);

        if (deleted) response = "Order deleted from db";
        else response = "Can't find an Order whit this id";

        await User.findByIdAndUpdate(
            deleted.user,
            {
                $pull: { orders: id },
            },
            { new: true }
        );

        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
};

const orderIdGet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("users").populate("products.product");

        return res.status(200).render("order", { user: req.user, order, isAdmin: req.isAdmin });
    } catch (error) {
        return next(error);
    }
};

module.exports = { ordersGet, createOrderPost, addProductPut, editPut, orderDelete, orderIdGet };
