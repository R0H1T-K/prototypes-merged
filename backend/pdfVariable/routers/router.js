const Router = require("express").Router;
const router = new Router();
const pdf = require("./routes/pdfRoutes");

router.route("/", ).get((req, res) => {
    res.json({ message: "pdf management API" });
});

router.use("/pdf", pdf);

module.exports = router;