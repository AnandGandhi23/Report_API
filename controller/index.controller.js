const db = require('../config/db.config');

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
    db.getConnection(async (err, connection) => {
        if (err) {
            console.log(err);
            return;
        }

        const franchiseIds = req.body.franchiseIds;
        console.log('franchiseIds---', req);
        const response = {};
        let sqlQuery
        for (const id of franchiseIds) {
            sqlQuery = "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE Location='" + id + "';" +
                "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE Location='" + id + "';" +
                "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE Location='" + id + "';" +
                "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE Location='" + id + "';" +
                "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE Location='" + id + "';" +
                "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE location='" + id + "';" +
                "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE location='" + id + "';" +
                "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND location='" + id + "'"

            console.log('sqlQuery--', sqlQuery);
            await connection.query(sqlQuery, function (err, results, fields) {
                if (!err) {
                    console.log(`for id: ${id}-------`, JSON.stringify(results));
                    // res.send(JSON.stringify(results));
                } else {
                    console.log('Error while performing query to get report data by franchise name', err);
                }
            });
        }
        connection.release();
    })
}

module.exports = {
    getReportData,
    getReportDataByYear,
    getReportDataByFranchiseName
}
