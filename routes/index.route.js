const express = require('express');
const indexController = require('../controller/index.controller');
const franchiseLocationController = require('../controller/franchise-location.controller');
const router = new express.Router();

router.get('/getReportData', indexController.getReportData);

router.get('/getReportDataByYear', indexController.getReportDataByYear);

router.get('/franchise-location/getDistinctFranchiseName', franchiseLocationController.getDistinctFranchiseName);

router.get('/franchise-location/getDistinctLocationGroup', franchiseLocationController.getDistinctLocationGroup);

router.get('/franchise-location/getDistinctLocationName', franchiseLocationController.getDistinctLocationName);

router.post('/getReportDataByFranchiseName', indexController.getReportDataByFranchiseName);

router.post('/getReportDataByLocationGroup', indexController.getReportDataByLocationGroup);

router.post('/getReportDataByLocationName', indexController.getReportDataByLocationName);

module.exports = router;