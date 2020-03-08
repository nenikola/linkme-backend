exports.isValid = (req, res, next) => {
  if (req.query.api_key === `DoXHwSAhJuQErIBfRg1mK3pDsQq2`) next();
  else res.status(401).send(`NON-VALID API KEY`);
};
