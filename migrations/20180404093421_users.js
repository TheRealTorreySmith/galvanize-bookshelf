exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (t) => {
        t.increments();
        t.string('first_name').notNull().defaultTo('');
        t.string('last_name').notNull().defaultTo('');
        t.string('email').notNull().defaultTo();
        t.specificType('hashed_password', 'CHAR(60)').notNull();
        t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
        t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
