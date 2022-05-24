const mysql = require('mysql2/promise');

async function GetData(table = 'dishes') {
    let query = `SELECT * FROM \`${table}\``;
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            database: 'vkr-lithium'
        });
    
        const [rows, fields] = await connection.execute(query);

        connection.end();
    
        return rows;
    }
    catch (err) {
        console.log(`[Error]: ${err.sqlMessage}`);
        // return false;
    }
}

module.exports.GetData = GetData;