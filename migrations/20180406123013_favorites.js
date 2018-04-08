exports.up = function(knex, Promise) {
    return knex.schema.createTable('favorites', (t) => {
      t.increments();
      t.integer('user_id').references('id').inTable('users').notNull().onDelete('cascade');
      t.integer('book_id').references('id').inTable('books').notNull().onDelete('cascade');
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    });
  };

    exports.down = function(knex, Promise) {
    return knex.schema.dropTable('favorites');
    };
