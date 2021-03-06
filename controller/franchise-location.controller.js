const db = require('../config/db.config');

const getDistinctFranchiseName = (req, res) => {
    db.getConnection((err, connection) => {
        if(err) { 
            console.log(err); 
            return; 
        }

        const sqlQuery =
        "SELECT DISTINCT franchise_name as label, franchise_id as value FROM `franchise_locations` WHERE franchise_id <> '' AND franchise_name is NOT null AND franchise_id NOT IN('CF0034', 'CF0037', 'CF0049') order by franchise_name;";
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
        "SELECT DISTINCT `location group` as label, `location group` as value FROM `franchise_locations` WHERE franchise_id NOT IN('CF0034', 'CF0037', 'CF0049') " + 
        "AND `location group` IS NOT NULL AND `location group` <> '' order by `location group`;";
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
        "SELECT DISTINCT `location group` as locationGroup, location_name as locationName,location_id as locationId FROM franchise_locations WHERE franchise_id NOT IN('CF0034', 'CF0037', 'CF0049') " +
        "AND `location group` IS NOT NULL AND `location group` <> '' ORDER BY `location group`;";
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
