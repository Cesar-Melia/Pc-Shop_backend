const adminGet = (req, res) => {
  return res.status(200).render('admin', { user: req.user, isAdmin: req.isAdmin });
};

module.exports = { adminGet };
