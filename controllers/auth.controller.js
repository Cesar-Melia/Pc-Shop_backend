const passport = require('passport');

const registerGet = (req, res, next) => {
  return res.render('register', { user: req.user, isAdmin: req.isAdmin });
};

const loginGet = (req, res, next) => {
  return res.render('login', { user: req.user, isAdmin: req.isAdmin });
};

const registerPost = (req, res, next) => {
  const done = (error, user) => {
    if (error) return next(error);
    console.log(user);
    return res.redirect('/products');
  };
  passport.authenticate('register', done)(req);
};

const loginPost = (req, res, next) => {
  const done = (error, user) => {
    if (error) return next(error);

    req.logIn(user, (error) => {
      if (error) return next(error);
      console.log(user);
      return res.redirect('/');
    });
  };
  passport.authenticate('login', done)(req);
};

const logoutPost = (req, res, next) => {
  if (req.user) {
    req.logout();

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.redirect('/');
    });
  } else {
    return res.status(200).json('No hay ningun usuario logueado');
  }
};

module.exports = { registerGet, loginGet, registerPost, loginPost, logoutPost };
