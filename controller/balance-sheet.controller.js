const { response } = require('express');
const db = require('../config/db.config');

const getCashAndCashEq = (req, res) => {
    console.log('getCashAndCashEq API called--')
    var franchiseIds = req.body.franchiseIds;
    console.log('franchiseIds', franchiseIds);
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }

        var invoiceCreationDate = req.query.invoiceCreationDate;
        console.log('invoiceCreationDate----', invoiceCreationDate);

        // SELECT franchise_id, balance FROM `wafed_bankchecking` where uniqueID IN (SELECT MAX(uniqueID) from `wafed_bankchecking` WHERE franchise_id = 'CF0114') 

        const sqlQuery1 = `SELECT franchise_id, balance as endingBankBalance FROM wafed_bankchecking where uniqueID IN (SELECT MAX(uniqueID) from wafed_bankchecking WHERE entryDate > '2015-01-01' AND entryDate <= '${invoiceCreationDate}' GROUP BY franchise_id HAVING franchise_id IN (?))`;
        const sqlQuery2 = `SELECT p.franchise_id, SUM(p.Expenses_Amount) - SUM(b.debit) unclearedCheck FROM bill_dot_com_payments p INNER JOIN wafed_bankchecking b `+
            `ON b.description REGEXP p.RefNumber AND p.franchise_id = b.franchise_id WHERE payment_method = 'Check' AND p.franchise_id in (?) AND p.EntryDate > '2015-01-01' AND p.EntryDate <= '${invoiceCreationDate}' GROUP BY p.franchise_id`;
        // const sqlQuery = `SELECT fl.franchise_id, SUM(sa.NetSales) as cashAndCashEq FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE ` + 
        //     `fl.franchise_id IN (?) AND sa.InvoiceCreationDate > '2015-01-01' AND sa.InvoiceCreationDate <= '${invoiceCreationDate}' GROUP BY fl.franchise_name`;
        
        Promise.all(
            [
                runSQLQueries(sqlQuery1, connection, franchiseIds),
                runSQLQueries(sqlQuery2, connection, franchiseIds),
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
                console.log('response---', response);
                res.send(JSON.stringify(response)); 
            })
    })
};

const getAccountsReceivables = (req, res) => {
    console.log('getAccountsReceivables API called--')
    var franchiseIds = req.body.franchiseIds;
    console.log('franchiseIds', franchiseIds);
    
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }

        var invoiceCreationDate = req.query.invoiceCreationDate;
        console.log('invoiceCreationDate----', invoiceCreationDate);

        const query1 = `SELECT fl.franchise_id, SUM(sa.NetSales) as netPrice FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE ` + 
            `fl.franchise_id IN (?) AND sa.InvoiceCreationDate > '2015-01-01' AND sa.InvoiceCreationDate <= '${invoiceCreationDate}' GROUP BY fl.franchise_name`;
        const query2 = `SELECT fl.franchise_id, SUM(st.tax_amt) tax FROM franchise_locations fl INNER JOIN sales_tax st ON fl.location_id = st.Location WHERE ` + 
            `fl.franchise_id IN (?) AND st.InvoiceCreationDate > '2015-01-01' AND st.InvoiceCreationDate <= '${invoiceCreationDate}' GROUP BY fl.franchise_name`;
        const query3 = `SELECT fl.franchise_id, SUM(pe.Net_Sales) refund FROM franchise_locations fl INNER JOIN payments_everything pe ON fl.location_id = pe.Location WHERE ` + 
            `fl.franchise_id IN (?) AND pe.InvoiceCreationDate > '2015-01-01' AND pe.InvoiceCreationDate <= '${invoiceCreationDate}' AND Net_Sales < 0 AND PaymentCreditType NOT REGEXP 'Donation' GROUP BY fl.franchise_name`;
        const query4 = `SELECT fl.franchise_id, SUM(pe.Net_Sales) donation FROM franchise_locations fl INNER JOIN payments_everything pe ON fl.location_id = pe.Location WHERE ` + 
            `fl.franchise_id IN (?) AND pe.InvoiceCreationDate > '2015-01-01' AND pe.InvoiceCreationDate <= '${invoiceCreationDate}' AND PaymentCreditType REGEXP 'Donation' GROUP BY fl.franchise_name`;
        const query5 = `SELECT fl.franchise_id, SUM(pe.Net_Sales) amountPaid FROM franchise_locations fl INNER JOIN payments_everything pe ON fl.location_id = pe.Location WHERE ` + 
            `fl.franchise_id IN (?) AND pe.InvoiceCreationDate > '2015-01-01' AND pe.InvoiceCreationDate <= '${invoiceCreationDate}' AND Net_Sales > 0 AND PaymentCreditType NOT REGEXP 'Donation' GROUP BY fl.franchise_name`;
        const query6 = `SELECT fl.franchise_id, SUM(wo.writeoff_amount) writeOffs FROM franchise_locations fl INNER JOIN writeoffs wo ON fl.location_id = wo.Location INNER JOIN sales_actual sa ON concat(wo.Location,wo.InvoiceNo) = sa.SaleId WHERE ` + 
            `fl.franchise_id IN (?) AND sa.InvoiceCreationDate > '2015-01-01' AND sa.InvoiceCreationDate <= '${invoiceCreationDate}' GROUP BY fl.franchise_name`;
        console.log('query--', query6);
            Promise.all(
            [
                runSQLQueries(query1, connection, franchiseIds),
                runSQLQueries(query2, connection, franchiseIds),
                runSQLQueries(query3, connection, franchiseIds),
                runSQLQueries(query4, connection, franchiseIds),
                runSQLQueries(query5, connection, franchiseIds),
                // runSQLQueries(query6, connection, franchiseIds)

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
                console.log('response---', response);
                res.send(JSON.stringify(response)); 
            })
    })
};

const getDebitedValues = (req, res) => {
    
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }

        var franchiseIds = req.body.franchiseIds;
        var invoiceCreationDate = req.query.invoiceCreationDate;

        const sqlQuery =
        `SELECT date_posted as date, debit as amount, check_number as type, description as name FROM wafed_bankchecking WHERE debit > 0 AND franchise_id = ${franchiseIds} AND date_posted > '2015-01-01' AND date_posted <= '${invoiceCreationDate}'`;
        connection.query(sqlQuery, function(err, results) {
            connection.release();
            if (!err) {
                res.send(JSON.stringify(results));
            }   else{
                console.log('Error while performing query to get debited values', err);
            }
        });
    })
};

async function runSQLQueries(sqlquery, connection, franchiseIds){
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
    getCashAndCashEq,
    getAccountsReceivables,
    getDebitedValues
}