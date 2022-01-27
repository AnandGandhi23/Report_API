const db = require('../config/db.config');

const getDistinctFranchiseName = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }

        const sqlQuery =
        "SELECT DISTINCT franchise_name as label, franchise_id as value FROM `franchise_locations` WHERE franchise_id NOT IN('CF0034', 'CF0037', 'CF0049') order by franchise_name;";
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

const getDistinctLocationGroup = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }

        const sqlQuery =
        "SELECT DISTINCT `location group` as label, location_id as value FROM `franchise_locations` WHERE franchise_id NOT IN('CF0034', 'CF0037', 'CF0049') order by `location group`;";
        connection.query(sqlQuery, function(err, results) {
            connection.release();
            if (!err) {
                res.send(JSON.stringify(results));
            }   else{
                console.log('Error while performing query to get location group', err);
            }
        });
    })
};

const getDistinctLocationName = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }

        const sqlQuery =
        "SELECT DISTINCT `location_name` as label, location_id as value FROM `franchise_locations` WHERE franchise_id NOT IN('CF0034', 'CF0037', 'CF0049', 'CF6684', 'CF0004') order by `location_name`;";
        connection.query(sqlQuery, function(err, results) {
            connection.release();
            if (!err) {
                res.send(JSON.stringify(results));
            }   else{
                console.log('Error while performing query to get location name', err);
            }
        });
    })
};

module.exports = {
    getDistinctFranchiseName,
    getDistinctLocationGroup,
    getDistinctLocationName
}
