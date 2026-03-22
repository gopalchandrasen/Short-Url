const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ err: "Url is required" });
  const existing = await URL.findOne({
    redirectURL: body.url,
    createdBy: req.user._id,
  });

  if (existing) {
    return res.render("home", { id: existing.shortId });
  }
  const shorID = nanoid(8);

  await URL.create({
    shortId: shorID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", { id: shorID });
}

async function handleGetURL(req, res) {
  console.log("In handle get url function");
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  if (!entry) {
    return res.status(404).json({ error: "Url not found" });
  }
  console.log("entry: ", entry);
  res.redirect(entry.redirectURL);
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  console.log(`shortId: ${shortId}`);
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
async function handleGetShortId(req, res) {
  console.log("In hendle get shortId function");
  const url = req.query.url;
  // const url = req.params.shortId;
  console.log(url);
  const result = await URL.findOne({ redirectURL: url });
  if (!result) {
    return res.status(404).json({ error: "url not found" });
  }
  return res.json({
    shortId: result.shortId,
  });
}

async function handleViewAll(req, res) {
  const allurls = await URL.find({ createdBy: req.user._id });
  return res.render("viewsAll", {
    urls: allurls,
  });
}

async function handleGoHome(req, res) {
  return res.render("home");
}

async function handleDeletebyShortId() {
  console.log("In delete function");
}
module.exports = {
  handleGenerateNewShortURL,
  handleGetURL,
  handleGetAnalytics,
  handleGetShortId,
  handleViewAll,
  handleGoHome,
};
