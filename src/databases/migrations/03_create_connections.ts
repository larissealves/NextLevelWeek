import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable( 'connections', table => {
        table.increments('id').primary();

        //Relacionamento: a conexão ocorreu com qual professor (tentou entrar em contato).

        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');   
            
        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP')) // hora que tentaram entrar em contato
            .notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('connections');
}