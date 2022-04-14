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

        const sqlQuery = `SELECT fl.franchise_id, SUM(sa.NetSales) as cashAndCashEq FROM franchise_locations fl INNER JOIN sales_actual sa ON fl.location_id = sa.Location WHERE ` + 
            `fl.franchise_id IN (?) AND AND sa.InvoiceCreationDate > '2015-01-01' AND sa.InvoiceCreationDate <= '${invoiceCreationDate}' GROUP BY fl.franchise_name`;
        
        connection.query(sqlQuery, [franchiseIds], function(err, results) {
            connection.release();
            if (!err) {
                
                const strResponse = JSON.stringify(results);
                const jsonResponse = JSON.parse(strResponse);

                const response = {};
                jsonResponse.map((data) => {
                    response[data['franchise_id']] = data['cashAndCashEq'];
                });
                res.send(JSON.stringify(response));
            }   else{
                console.log('Error while performing query to get cash and cash equivalents', err);
            }
        });
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
        const query6 = `SELECT fl.franchise_id, SUM(wo.writeoff_amount) writeOffs FROM franchise_locations fl INNER JOIN writeoffs wo ON fl.location_id = wo.Location WHERE ` + 
            `fl.franchise_id IN (?) GROUP BY fl.franchise_name`;
        Promise.all(
            [
                runAccountsReceivablesQueries(query1, connection, franchiseIds),
                runAccountsReceivablesQueries(query2, connection, franchiseIds),
                runAccountsReceivablesQueries(query3, connection, franchiseIds),
                runAccountsReceivablesQueries(query4, connection, franchiseIds),
                runAccountsReceivablesQueries(query5, connection, franchiseIds),
                runAccountsReceivablesQueries(query6, connection, franchiseIds)

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

async function runAccountsReceivablesQueries(sqlquery, connection, franchiseIds){
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
    getAccountsReceivables
}