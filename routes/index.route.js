const express = require('express');
const controller = require('../controller/index.controller');
const router = new express.Router();

router.get('/getReportData', controller.getReportData);

router.get('/getReportDataByYear', controller.getReportDataByYearr);

module.exports = router;