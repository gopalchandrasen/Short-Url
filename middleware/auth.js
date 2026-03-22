const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  const userUid = await req.cookies?.uid;
  if (!userUid) return res.redirect("/user/login");
  const user = getUser(userUid);
  if (!user) return res.redirect("/user/login");
  req.user = user;
  console.log("req.user: ", req.user);
  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
};
