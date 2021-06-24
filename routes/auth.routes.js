const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/auth.middleware');
const { registerPost, loginPost, logoutPost } = require('../controllers/auth.controller');

router.post('/register', registerPost);

router.post('/login', loginPost);

router.post('/logout', isAuth, logoutPost);

module.exports = router;
