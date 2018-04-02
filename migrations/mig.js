'use strict';


exports.up = function(knex, Promise) {
    return knex.schema.createTable('books', (t) => {
        t.increments('id').unsigned().primary();
        t.string('title').notNull().defaultTo('');
        t.string('author').notNull().defaultTo('');
        t.string('genre').notNull().defaultTo('');
        t.text('description').notNull().defaultTo('');
        t.text('cover_url').notNull().defaultTo('');
        t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
        t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('books');
};
