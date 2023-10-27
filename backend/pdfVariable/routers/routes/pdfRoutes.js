const Router = require("express").Router;
const router = new Router();
const controller = require("../../connection/pdfControllers");

router
    .route("/convertCsvToPdf")
    .post((...args) => controller.convertCsvToPdf(...args));

router
    .route("/spiltPdf")
    .post((...args) => controller.spiltPdf(...args));

router
    .route("/mergePdf")
    .post((...args) => controller.mergePdf(...args));

module.exports = router