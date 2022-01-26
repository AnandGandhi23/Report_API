const db = require('../config/db.config');
var async = require("async");

const getReportData = (req, res) => {
    console.log('getReportData API called--')
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        const sqlQuery =
        "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE `Transaction Date` NOT REGEXP '0000-00-00' AND (`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "')"
        connection.query(sqlQuery, function(err, results) {
            connection.release();
            if (!err) {
                res.send(JSON.stringify(results));
            }   else{
                console.log('Error while performing query to get report data', err);
            }
        });
    })
};

const getReportDataByYear = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var year = req.query.year;
        const sqlQuery = "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND year(TransactionDate)=" + year + ";" + 
        "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND year(TransactionDate)=" + year + ";" +
        "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND year(TransactionDate)=" + year + ";" +
        "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE year(TransactionDate)=" + year + ";" +
        "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE year(`Transaction Date`)=" + year + ";" +
        "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE year(sale_date)=" + year + ";" +
        "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE year(sale_date)=" + year + ";" +
        "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND year(sale_date)=" + year

        connection.query(sqlQuery, function(err, results, fields) {
            connection.release();
            if (!err) {
                res.send(JSON.stringify(results));
            }   else{
                console.log('Error while performing query to get yearly report data', err);
            }
        });
    })
}

const getReportDataByFranchiseName = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var franchiseIds = req.body.franchiseIds;
        const sqlQuery = 
        "SELECT fl.franchise_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) AND sa.TransactionType='Sale' GROUP BY fl.franchise_name;" +
        "SELECT fl.franchise_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) AND sa.TransactionType='Returned' GROUP BY fl.franchise_name;" +
        "SELECT fl.franchise_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) AND sa.TransactionType='Cancelled' GROUP BY fl.franchise_name;" +
        "SELECT fl.franchise_id, SUM(sa.NetSales) TotalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) GROUP BY fl.franchise_name;" +
        "SELECT fl.franchise_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
            "fl.franchise_id IN (?) GROUP BY fl.franchise_name;" +
        "SELECT fl.franchise_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
            "fl.franchise_id IN (?) GROUP BY fl.franchise_name;" +
        "SELECT fl.franchise_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.franchise_id IN (?) GROUP BY fl.franchise_name;" +
        "SELECT fl.franchise_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.franchise_id IN (?) AND nhc.role='Telemarketing' GROUP BY fl.franchise_name;"

        const response = {};
        connection.query(sqlQuery, [ franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds ], function(err, results, fields) {
            connection.release();
            if (!err) {
                const strResponse = JSON.stringify(results);
                const jsonResponse = JSON.parse(strResponse);
                jsonResponse.map((data) => {
                    Array.from(data).forEach(obj => {
                        Object.keys(obj).forEach(key => {
                            if (key !== 'franchise_id') {
                                if (!response[`${obj['franchise_id']}`]) {
                                    response[`${obj['franchise_id']}`] = {};
                                }
                                response[`${obj['franchise_id']}`][key] = obj[key];
                            }
                        });
                    });
                });
                res.send(JSON.stringify(response));
            }   else{
                console.log('Error while performing query to get report data by franchise name', err);
            }
        });
    })
}

const getReportDataByLocationGroup = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var franchiseIds = req.body.franchiseIds;
        const sqlQuery = 
        "SELECT fl.location_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionType='Sale' GROUP BY fl.`location group`;" +
        "SELECT fl.location_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionType='Returned' GROUP BY fl.`location group`;" +
        "SELECT fl.location_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionType='Cancelled' GROUP BY fl.`location group`;" +
        "SELECT fl.location_id, SUM(sa.NetSales) TotalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location group`;" +
        "SELECT fl.location_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location group`;" +
        "SELECT fl.location_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location group`;" +
        "SELECT fl.location_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location group`;" +
        "SELECT fl.location_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.location_id IN (?) AND nhc.role='Telemarketing' GROUP BY fl.`location group`;"

        const response = {};
        connection.query(sqlQuery, [ franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds ], function(err, results, fields) {
            connection.release();
            if (!err) {
                const strResponse = JSON.stringify(results);
                const jsonResponse = JSON.parse(strResponse);
                jsonResponse.map((data) => {
                    Array.from(data).forEach(obj => {
                        Object.keys(obj).forEach(key => {
                            if (key !== 'location_id') {
                                if (!response[`${obj['location_id']}`]) {
                                    response[`${obj['location_id']}`] = {};
                                }
                                response[`${obj['location_id']}`][key] = obj[key];
                            }
                        });
                    });
                });
                res.send(JSON.stringify(response));
            }   else{
                console.log('Error while performing query to get report data by location group', err);
            }
        });
    })
}

const getReportDataByLocationName = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var franchiseIds = req.body.franchiseIds;
        const sqlQuery = 
        "SELECT fl.location_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionType='Sale' GROUP BY fl.`location_name`;" +
        "SELECT fl.location_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionType='Returned' GROUP BY fl.`location_name`;" +
        "SELECT fl.location_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionType='Cancelled' GROUP BY fl.`location_name`;" +
        "SELECT fl.location_id, SUM(sa.NetSales) TotalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location_name`;" +
        "SELECT fl.location_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location_name`;" +
        "SELECT fl.location_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location_name`;" +
        "SELECT fl.location_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.location_id IN (?) GROUP BY fl.`location_name`;" +
        "SELECT fl.location_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.location_id IN (?) AND nhc.role='Telemarketing' GROUP BY fl.`location_name`;"

        const response = {};
        connection.query(sqlQuery, [ franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds ], function(err, results, fields) {
            connection.release();
            if (!err) {
                const strResponse = JSON.stringify(results);
                const jsonResponse = JSON.parse(strResponse);
                jsonResponse.map((data) => {
                    Array.from(data).forEach(obj => {
                        Object.keys(obj).forEach(key => {
                            if (key !== 'location_id') {
                                if (!response[`${obj['location_id']}`]) {
                                    response[`${obj['location_id']}`] = {};
                                }
                                response[`${obj['location_id']}`][key] = obj[key];
                            }
                        });
                    });
                });
                res.send(JSON.stringify(response));
            }   else{
                console.log('Error while performing query to get report data by location group', err);
            }
        });
    })
}

module.exports = {
    getReportData,
    getReportDataByYear,
    getReportDataByFranchiseName,
    getReportDataByLocationGroup,
    getReportDataByLocationName
}
