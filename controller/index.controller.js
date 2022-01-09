const db = require('../config/db.config');

const getReportData = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;

        const sqlQuery = 
        "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND TransactionDate BETWEEN " + startDate + " AND " + endDate + ";" + 
        "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND TransactionDate BETWEEN " + startDate + " AND " + endDate + ";" + 
        "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND TransactionDate BETWEEN " + startDate + " AND " + endDate + ";" + 
        "SELECT SUM(NetSales) as totalIncome FROM sales_actual WHERE TransactionDate BETWEEN " + startDate + " AND " + endDate + ";" + 
        "SELECT SUM(Expenses_Amount) as cogs FROM cogs WHERE 'Transaction Date' BETWEEN " + startDate + " AND " + endDate + ";" + 
        "SELECT SUM(commission_due) as commissionConsultant FROM commissions WHERE sale_date BETWEEN " + startDate + " AND " + endDate + ";" + 
        "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions` WHERE sale_date BETWEEN " + startDate + " AND " + endDate + ";" + 
        "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing' AND sale_date BETWEEN " + startDate + " AND " + endDate

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

const getReportDataByYearr = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) {
            console.log(err); 
            return; 
        }

        var year = req.query.year;
        const sqlQuery = "SELECT SUM(NetSales) as grossSale FROM sales_actual WHERE TransactionType='Sale' AND year(date)=" + year + ";" + 
        "SELECT SUM(NetSales) as returnSale FROM sales_actual WHERE TransactionType='Returned' AND year(date)=" + year + ";" +
        "SELECT SUM(NetSales) as cancelIncome FROM sales_actual WHERE TransactionType='Cancelled' AND year(date)=" + year + ";" +
        "SELECT SUM(NetSales) as totalIncome FROM sales_actual;" +
        "SELECT SUM(Expenses_Amount) as cogs FROM cogs;" +
        "SELECT SUM(commission_due) as commissionConsultant FROM commissions;" +
        "SELECT SUM(commission_due) as commissionPCC FROM `non-hcp_commissions`;" +
        "SELECT SUM(commission_due) as commissionTelemarketing FROM `non-hcp_commissions` WHERE role='Telemarketing'";

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

module.exports = {
    getReportData,
    getReportDataByYearr
}
