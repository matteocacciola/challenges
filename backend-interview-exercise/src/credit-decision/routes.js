const AsyncRouter = require("express-async-router").AsyncRouter;
const router = AsyncRouter();
const jsonParser = require("body-parser").json();
const validate = require("express-validation");
const schema = require("./schema");
const deserialize = require("../lib/middleware/to-camel-case");
const { StatusCodes } = require("http-status-codes");
const { getDecision } = require("./service");

router.use([jsonParser, validate({ body: schema }), deserialize]);

router.post("/", async (req, res) => {
  const { amount, email } = req.body;
  const decision = await getDecision(amount, email);
  return res.status(decision.accepted ? StatusCodes.CREATED : StatusCodes.OK).json(decision);
});

module.exports = router;
