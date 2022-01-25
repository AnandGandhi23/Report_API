const db = require('../config/db.config');

const getDistinctFranchiseName = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;

        const sqlQuery =
        "SELECT DISTINCT franchise_name as label, franchise_id as value FROM `franchise_locations`;";
        connection.query(sqlQuery, function(err, results) {
            connection.release();
            if (!err) {
                res.send(JSON.stringify(results));
            }   else{
                console.log('Error while performing query to get franchise name', err);
            }
        });
    })
};
module.exports = {
    getDistinctFranchiseName
}
