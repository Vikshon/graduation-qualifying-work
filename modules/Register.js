const mysql = require('mysql2/promise');

async function Registrate({name, phoneNumber, password, roleId}) {
    let query = `INSERT INTO \`employees\` (\`id\`, \`Name\`, \`Phone number\`, \`Password\`, \`Role id\`) VALUES (NULL, '${name}', '${phoneNumber}', '${password}', ${roleId})`;
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            database: 'vkr-lithium'
        });
        
        await connection.execute(query);

        connection.end();
    }
    catch (err) {
        console.log(`[Error]: ${err.sqlMessage}`);
        // return false;
    }
}

module.exports.Registrate = Registrate;