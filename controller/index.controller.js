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
        // const sqlQuery =
        // "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        // "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        // "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        // "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        // "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE `Transaction Date` NOT REGEXP '0000-00-00' AND (`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        // "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        // "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "');" +
        // "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "')"
        
        const query1 = "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');";
        const query2 = "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');";
        const query3 = "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');";
        const query4 = "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE TransactionDate NOT REGEXP '0000-00-00' AND (TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "');";
        const query5 = "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE `Transaction Date` NOT REGEXP '0000-00-00' AND (`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "');";
        const query6 = "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "');";
        const query7 = "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "');";
        const query8 = "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND sale_date NOT REGEXP '0000-00-00' AND (sale_date BETWEEN '" + startDate + "' AND '" + endDate + "')";
        const query9 = "SELECT SUM(bill.Expenses_Amount) as operatingExpenses FROM `bill_dot_com_bills` bill INNER JOIN chart_of_accounts coa ON bill.Expenses_Account = coa.account_name " + 
            "INNER JOIN franchise_locations fl ON bill.Expenses_Class = fl.location_name WHERE coa.type = 'Operating Expenses' AND bill.Transaction_Date NOT REGEXP '0000-00-00' AND (bill.Transaction_Date BETWEEN '" + startDate + "' AND '" + endDate + "')";

        Promise.all(
            [
                selectquery(query1, connection),
                selectquery(query2, connection),
                selectquery(query3, connection),
                selectquery(query4, connection),
                selectquery(query5, connection),
                selectquery(query6, connection),
                selectquery(query7, connection),
                selectquery(query8, connection),
                selectquery(query9, connection)

            ])
            .then((results) => {
                let response = {};
                results.map((data) => {
                    const objData = data[0];
                    Object.keys(objData).forEach(key => {
                        response[key] = objData[key];
                    });
                });
                res.send(JSON.stringify(response)); 
            })
        
        // connection.query(sqlQuery, function(err, results) {
        //     connection.release();
        //     if (!err) {
        //         let response = {};
        //         results.map((data) => {
        //             const objData = data[0];
        //             Object.keys(objData).forEach(key => {
        //                 response[key] = objData[key];
        //             });
        //         });
        //         res.send(JSON.stringify(response));
        //     }   else{
        //         console.log('Error while performing query to get report data', err);
        //     }
        // });
    })
};

const getReportDataByYear = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var year = req.query.year;
        // const sqlQuery = "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND year(TransactionDate)=" + year + ";" + 
        // "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND year(TransactionDate)=" + year + ";" +
        // "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND year(TransactionDate)=" + year + ";" +
        // "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE year(TransactionDate)=" + year + ";" +
        // "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE year(`Transaction Date`)=" + year + ";" +
        // "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE year(sale_date)=" + year + ";" +
        // "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE year(sale_date)=" + year + ";" +
        // "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND year(sale_date)=" + year

        const query1 = "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND year(TransactionDate)=" + year;
        const query2 = "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND year(TransactionDate)=" + year;
        const query3 = "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND year(TransactionDate)=" + year;
        const query4 = "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE year(TransactionDate)=" + year;
        const query5 = "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE year(`Transaction Date`)=" + year;
        const query6 = "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE year(sale_date)=" + year;
        const query7 = "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE year(sale_date)=" + year;
        const query8 = "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND year(sale_date)=" + year;
        const query9 = "SELECT SUM(bill.Expenses_Amount) as operatingExpenses FROM `bill_dot_com_bills` bill INNER JOIN chart_of_accounts coa ON bill.Expenses_Account = coa.account_name " + 
            "INNER JOIN franchise_locations fl ON bill.Expenses_Class = fl.location_name WHERE coa.type = 'Operating Expenses' AND year(bill.Transaction_Date)=" + year;

        Promise.all(
            [
                selectquery(query1, connection),
                selectquery(query2, connection),
                selectquery(query3, connection),
                selectquery(query4, connection),
                selectquery(query5, connection),
                selectquery(query6, connection),
                selectquery(query7, connection),
                selectquery(query8, connection),
                selectquery(query9, connection)
            ])
            .then((results) => {
                let response = {};
                results.map((data) => {
                    const objData = data[0];
                    Object.keys(objData).forEach(key => {
                        response[key] = objData[key];
                    });
                });
                res.send(JSON.stringify(response)); 
            })
        
        
        // connection.query(sqlQuery, function(err, results, fields) {
        //     connection.release();
        //     if (!err) {
        //         let response = {};
        //         results.map((data) => {
        //             const objData = data[0];
        //             Object.keys(objData).forEach(key => {
        //                 response[key] = objData[key];
        //             });
        //         });
        //         res.send(JSON.stringify(response));
        //     }   else{
        //         console.log('Error while performing query to get yearly report data', err);
        //     }
        // });
    })
}

const getReportDataByFranchiseName = (req, res) => {
    console.log('getReportDataByFranchiseName API called--')
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        var franchiseIds = req.body.franchiseIds;
        // const sqlQuery = 
        // "SELECT fl.franchise_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Sale' GROUP BY fl.franchise_name;" +
        // "SELECT fl.franchise_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Returned' GROUP BY fl.franchise_name;" +
        // "SELECT fl.franchise_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Cancelled' GROUP BY fl.franchise_name;" +
        // "SELECT fl.franchise_id, SUM(sa.NetSales) totalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name;" +
        // "SELECT fl.franchise_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
        //     "fl.franchise_id IN (?) AND cg.`Transaction Date` NOT REGEXP '0000-00-00' AND (cg.`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name;" +
        // "SELECT fl.franchise_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
        //     "fl.franchise_id IN (?) AND cc.sale_date NOT REGEXP '0000-00-00' AND (cc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name;" +
        // "SELECT fl.franchise_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
        //     "fl.franchise_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name;" +
        // "SELECT fl.franchise_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
        //     "fl.franchise_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') AND nhc.role='Telemarketing' GROUP BY fl.franchise_name;"

        const query1 = "SELECT fl.franchise_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Sale' GROUP BY fl.franchise_name";
        const query2 = "SELECT fl.franchise_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Returned' GROUP BY fl.franchise_name";
        const query3 = "SELECT fl.franchise_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Cancelled' GROUP BY fl.franchise_name";
        const query4 = "SELECT fl.franchise_id, SUM(sa.NetSales) totalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.franchise_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name";
        const query5 = "SELECT fl.franchise_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
            "fl.franchise_id IN (?) AND cg.`Transaction Date` NOT REGEXP '0000-00-00' AND (cg.`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name";
        const query6 = "SELECT fl.franchise_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
            "fl.franchise_id IN (?) AND cc.sale_date NOT REGEXP '0000-00-00' AND (cc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name";
        const query7 = "SELECT fl.franchise_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.franchise_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name";
        const query8 = "SELECT fl.franchise_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.franchise_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') AND nhc.role='Telemarketing' GROUP BY fl.franchise_name";
        const query9 = "SELECT fl.franchise_id, SUM(bill.Expenses_Amount) operatingExpenses FROM `bill_dot_com_bills` bill INNER JOIN chart_of_accounts coa ON bill.Expenses_Account = coa.account_name " + 
            "INNER JOIN franchise_locations fl ON bill.Expenses_Class = fl.location_name WHERE coa.type = 'Operating Expenses' AND fl.franchise_id IN (?) AND bill.Transaction_Date NOT REGEXP '0000-00-00' AND " +
             "(bill.Transaction_Date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.franchise_name";
        Promise.all(
            [
                selectFilteredQuery(query1, connection, franchiseIds),
                selectFilteredQuery(query2, connection, franchiseIds),
                selectFilteredQuery(query3, connection, franchiseIds),
                selectFilteredQuery(query4, connection, franchiseIds),
                selectFilteredQuery(query5, connection, franchiseIds),
                selectFilteredQuery(query6, connection, franchiseIds),
                selectFilteredQuery(query7, connection, franchiseIds),
                selectFilteredQuery(query8, connection, franchiseIds),
                selectFilteredQuery(query9, connection, franchiseIds)
            ])
            .then((results) => {
                let response = {};
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
            })

        // const response = {};
        // connection.query(sqlQuery, [ franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds ], function(err, results, fields) {
        //     connection.release();
        //     if (!err) {
        //         const strResponse = JSON.stringify(results);
        //         const jsonResponse = JSON.parse(strResponse);
        //         jsonResponse.map((data) => {
        //             Array.from(data).forEach(obj => {
        //                 Object.keys(obj).forEach(key => {
        //                     if (key !== 'franchise_id') {
        //                         if (!response[`${obj['franchise_id']}`]) {
        //                             response[`${obj['franchise_id']}`] = {};
        //                         }
        //                         response[`${obj['franchise_id']}`][key] = obj[key];
        //                     }
        //                 });
        //             });
        //         });
        //         res.send(JSON.stringify(response));
        //     }   else{
        //         console.log('Error while performing query to get report data by franchise name', err);
        //     }
        // });
    })
}

const getReportDataByLocationGroup = (req, res) => {
    console.log('getReportDataByLocationGroup API called--')
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        var franchiseIds = req.body.franchiseIds;
        // const sqlQuery = 
        // "SELECT fl.location_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Sale' GROUP BY fl.`location group`;" +
        // "SELECT fl.location_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Returned' GROUP BY fl.`location group`;" +
        // "SELECT fl.location_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Cancelled' GROUP BY fl.`location group`;" +
        // "SELECT fl.location_id, SUM(sa.NetSales) totalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`;" +
        // "SELECT fl.location_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
        //     "fl.location_id IN (?) AND cg.`Transaction Date` NOT REGEXP '0000-00-00' AND (cg.`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`;" +
        // "SELECT fl.location_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
        //     "fl.location_id IN (?) AND cc.sale_date NOT REGEXP '0000-00-00' AND (cc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`;" +
        // "SELECT fl.location_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
        //     "fl.location_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`;" +
        // "SELECT fl.location_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
        //     "fl.location_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') AND nhc.role='Telemarketing' GROUP BY fl.`location group`;"

        const query1 = "SELECT fl.`location group`, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.`location group` IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Sale' GROUP BY fl.`location group`";
        const query2 = "SELECT fl.`location group`, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.`location group` IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Returned' GROUP BY fl.`location group`";
        const query3 = "SELECT fl.`location group`, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.`location group` IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Cancelled' GROUP BY fl.`location group`";
        const query4 = "SELECT fl.`location group`, SUM(sa.NetSales) totalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.`location group` IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`"
        const query5 = "SELECT fl.`location group`, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
            "fl.`location group` IN (?) AND cg.`Transaction Date` NOT REGEXP '0000-00-00' AND (cg.`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`"
        const query6 = "SELECT fl.`location group`, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
            "fl.`location group` IN (?) AND cc.sale_date NOT REGEXP '0000-00-00' AND (cc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`"
        const query7 = "SELECT fl.`location group`, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.`location group` IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`"
        const query8 = "SELECT fl.`location group`, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.`location group` IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') AND nhc.role='Telemarketing' GROUP BY fl.`location group`"
        const query9 = "SELECT fl.`location group`, SUM(bill.Expenses_Amount) operatingExpenses FROM `bill_dot_com_bills` bill INNER JOIN chart_of_accounts coa ON bill.Expenses_Account = coa.account_name " + 
            "INNER JOIN franchise_locations fl ON bill.Expenses_Class = fl.location_name WHERE coa.type = 'Operating Expenses' AND fl.`location group` IN (?) AND bill.Transaction_Date NOT REGEXP '0000-00-00' AND " +
             "(bill.Transaction_Date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`";
        
        Promise.all(
            [
                selectFilteredQuery(query1, connection, franchiseIds),
                selectFilteredQuery(query2, connection, franchiseIds),
                selectFilteredQuery(query3, connection, franchiseIds),
                selectFilteredQuery(query4, connection, franchiseIds),
                selectFilteredQuery(query5, connection, franchiseIds),
                selectFilteredQuery(query6, connection, franchiseIds),
                selectFilteredQuery(query7, connection, franchiseIds),
                selectFilteredQuery(query8, connection, franchiseIds),
                selectFilteredQuery(query9, connection, franchiseIds)
            ])
            .then((results) => {
                let response = {};
                const strResponse = JSON.stringify(results);
                const jsonResponse = JSON.parse(strResponse);
                jsonResponse.map((data) => {
                    Array.from(data).forEach(obj => {
                        Object.keys(obj).forEach(key => {
                            if (key !== 'location group') {
                                if (!response[`${obj['location group']}`]) {
                                    response[`${obj['location group']}`] = {};
                                }
                                response[`${obj['location group']}`][key] = obj[key];
                            }
                        });
                    });
                });
                res.send(JSON.stringify(response)); 
            })

        // const response = {};
        // connection.query(sqlQuery, [ franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds ], function(err, results, fields) {
        //     connection.release();
        //     if (!err) {
        //         const strResponse = JSON.stringify(results);
        //         const jsonResponse = JSON.parse(strResponse);
        //         jsonResponse.map((data) => {
        //             Array.from(data).forEach(obj => {
        //                 Object.keys(obj).forEach(key => {
        //                     if (key !== 'location_id') {
        //                         if (!response[`${obj['location_id']}`]) {
        //                             response[`${obj['location_id']}`] = {};
        //                         }
        //                         response[`${obj['location_id']}`][key] = obj[key];
        //                     }
        //                 });
        //             });
        //         });
        //         res.send(JSON.stringify(response));
        //     }   else{
        //         console.log('Error while performing query to get report data by location group', err);
        //     }
        // });
    })
}

const getReportDataByLocationName = (req, res) => {
    console.log('getReportDataByLocationName API called--')

    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        var franchiseIds = req.body.franchiseIds;
        // const sqlQuery = 
        // "SELECT fl.location_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Sale' GROUP BY fl.`location_name`;" +
        // "SELECT fl.location_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Returned' GROUP BY fl.`location_name`;" +
        // "SELECT fl.location_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Cancelled' GROUP BY fl.`location_name`;" +
        // "SELECT fl.location_id, SUM(sa.NetSales) totalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        //     "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`;" +
        // "SELECT fl.location_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
        //     "fl.location_id IN (?) AND cg.`Transaction Date` NOT REGEXP '0000-00-00' AND (cg.`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`;" +
        // "SELECT fl.location_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
        //     "fl.location_id IN (?) AND cc.sale_date NOT REGEXP '0000-00-00' AND (cc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`;" +
        // "SELECT fl.location_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
        //     "fl.location_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`;" +
        // "SELECT fl.location_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
        //     "fl.location_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') AND nhc.role='Telemarketing' GROUP BY fl.`location_name`;"

        const query1 = "SELECT fl.location_id, SUM(sa.NetSales) grossSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Sale' GROUP BY fl.`location_name`";
        const query2 = "SELECT fl.location_id, SUM(sa.NetSales) returnSale FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Returned' GROUP BY fl.`location_name`";
        const query3 = "SELECT fl.location_id, SUM(sa.NetSales) cancelIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
        "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') AND sa.TransactionType='Cancelled' GROUP BY fl.`location_name`";
        const query4 = "SELECT fl.location_id, SUM(sa.NetSales) totalIncome FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE " + 
            "fl.location_id IN (?) AND sa.TransactionDate NOT REGEXP '0000-00-00' AND (sa.TransactionDate BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`";
        const query5 = "SELECT fl.location_id, SUM(cg.Expenses_Amount) cogs FROM franchise_locations fl INNER JOIN cogs cg ON fl.location_id = cg.Location WHERE " + 
            "fl.location_id IN (?) AND cg.`Transaction Date` NOT REGEXP '0000-00-00' AND (cg.`Transaction Date` BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`";
        const query6 = "SELECT fl.location_id, SUM(cc.commission_due) commissionConsultant FROM franchise_locations fl INNER JOIN commissions cc ON fl.location_id = cc.location WHERE " + 
            "fl.location_id IN (?) AND cc.sale_date NOT REGEXP '0000-00-00' AND (cc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`";
        const query7 = "SELECT fl.location_id, SUM(nhc.commission_due) commissionPCC FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.location_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location_name`";
        const query8 = "SELECT fl.location_id, SUM(nhc.commission_due) commissionTelemarketing FROM franchise_locations fl INNER JOIN `non-hcp_commissions` nhc ON fl.location_id = nhc.location WHERE " + 
            "fl.location_id IN (?) AND nhc.sale_date NOT REGEXP '0000-00-00' AND (nhc.sale_date BETWEEN '" + startDate + "' AND '" + endDate + "') AND nhc.role='Telemarketing' GROUP BY fl.`location_name`";
        const query9 = "SELECT fl.location_id, SUM(bill.Expenses_Amount) operatingExpenses FROM `bill_dot_com_bills` bill INNER JOIN chart_of_accounts coa ON bill.Expenses_Account = coa.account_name " + 
            "INNER JOIN franchise_locations fl ON bill.Expenses_Class = fl.location_name WHERE coa.type = 'Operating Expenses' AND fl.location_id IN (?) AND bill.Transaction_Date NOT REGEXP '0000-00-00' AND " +
             "(bill.Transaction_Date BETWEEN '" + startDate + "' AND '" + endDate + "') GROUP BY fl.`location group`";
            Promise.all(
                [
                    selectFilteredQuery(query1, connection, franchiseIds),
                    selectFilteredQuery(query2, connection, franchiseIds),
                    selectFilteredQuery(query3, connection, franchiseIds),
                    selectFilteredQuery(query4, connection, franchiseIds),
                    selectFilteredQuery(query5, connection, franchiseIds),
                    selectFilteredQuery(query6, connection, franchiseIds),
                    selectFilteredQuery(query7, connection, franchiseIds),
                    selectFilteredQuery(query8, connection, franchiseIds),
                    selectFilteredQuery(query9, connection, franchiseIds)
                ])
                .then((results) => {
                    let response = {};
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
                })
    
        // const response = {};
        // connection.query(sqlQuery, [ franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds, franchiseIds ], function(err, results, fields) {
        //     connection.release();
        //     if (!err) {
        //         const strResponse = JSON.stringify(results);
        //         const jsonResponse = JSON.parse(strResponse);
        //         jsonResponse.map((data) => {
        //             Array.from(data).forEach(obj => {
        //                 Object.keys(obj).forEach(key => {
        //                     if (key !== 'location_id') {
        //                         if (!response[`${obj['location_id']}`]) {
        //                             response[`${obj['location_id']}`] = {};
        //                         }
        //                         response[`${obj['location_id']}`][key] = obj[key];
        //                     }
        //                 });
        //             });
        //         });
        //         res.send(JSON.stringify(response));
        //     }   else{
        //         console.log('Error while performing query to get report data by location group', err);
        //     }
        // });
    })
}

async function selectquery(sqlquery, connection){
    return new Promise((resolve, reject) => {
        connection.query(sqlquery, (err,result)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    });
}

async function selectFilteredQuery(sqlquery, connection, franchiseIds){
    return new Promise((resolve, reject) => {
        connection.query(sqlquery, [franchiseIds], (err,result)=>{
            if(err){
                console.log('error--', err)
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    });
}


module.exports = {
    getReportData,
    getReportDataByYear,
    getReportDataByFranchiseName,
    getReportDataByLocationGroup,
    getReportDataByLocationName
}
