const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;
    if (!body.url) {
      return res.status(400).json({ err: "Url is required" });
    }

    const existing = await URL.findOne({
      redirectURL: body.url,
      createdBy: req.user ? req.user._id : null,
    });

    if (existing) {
      return res.status(200).json({ id: existing.shortId, createdBy: req.user ? req.user._id : null });
      // return res.render("home", { id: existing.shortId });
    }
    const shortID = nanoid(8);

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user ? req.user._id : null,
    });
    return res.status(200).json({ id: shortID, createdBy: req.user ? req.user._id : null });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
  // return res.render("home", { id: shorID });
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
  return res.json({
    url: entry.redirectURL,
  });
  // res.redirect(entry.redirectURL);
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  console.log(`shortId: ${shortId}`);
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    // analytics: result.visitHistory,
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


module.exports = {
  handleGenerateNewShortURL,
  handleGetURL,
  handleGetAnalytics,
  handleGetShortId,
  handleViewAll,
};
