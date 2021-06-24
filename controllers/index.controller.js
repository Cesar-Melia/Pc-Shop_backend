const indexGet = (req, res) => {
  const message = 'PC Shop API';
  return res.status(200).json(message);
};

module.exports = { indexGet };
