const express = require('express');
const indexController = require('../controller/index.controller');
const franchiseLocationController = require('../controller/franchise-location.controller');
const authenticationController = require('../controller/authentication/authentication.controller');
const balanceSheetController = require('../controller/balance-sheet.controller');
const router = new express.Router();

router.get('/getReportData', indexController.getReportData);

router.get('/getReportDataByYear', indexController.getReportDataByYear);

router.get('/franchise-location/getDistinctFranchiseName', franchiseLocationController.getDistinctFranchiseName);

router.get('/franchise-location/getDistinctLocationGroup', franchiseLocationController.getDistinctLocationGroup);

router.get('/franchise-location/getDistinctLocationName', franchiseLocationController.getDistinctLocationName);

router.post('/getReportDataByFranchiseName', indexController.getReportDataByFranchiseName);

router.post('/getReportDataByLocationGroup', indexController.getReportDataByLocationGroup);

router.post('/getReportDataByLocationName', indexController.getReportDataByLocationName);

router.post('/authentication', authenticationController.authentication);

router.post('/balance-sheet/getCashAndCashEq', balanceSheetController.getCashAndCashEq);

router.post('/balance-sheet/getAccountsReceivables', balanceSheetController.getAccountsReceivables);

router.post('/balance-sheet/getDebitedValues', balanceSheetController.getDebitedValues);

router.post('/balance-sheet/getCreditedValues', balanceSheetController.getCreditedValues);


module.exports = router;