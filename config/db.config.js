const mysql = require('mysql');

const db = mysql.createPool({
  host : 'phpstack-426242-1347501.cloudwaysapps.com',
  user :  'munymhmzmd',
  password: 'VCDvNhtkEL4B',
  database: 'munymhmzmd',
  multipleStatements: true
});
  
module.exports = db;