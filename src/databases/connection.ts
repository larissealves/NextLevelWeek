import knex from 'knex';
import path from 'path';

// migrations - controla a versão do BD;

const db = knex ({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')    
    },
    useNullAsDefault: true, //quando n souber o valor padrão para campos n preenchidos, usar null 
})

export default db;