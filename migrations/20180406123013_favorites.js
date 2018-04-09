exports.up = function(knex, Promise) {
    return knex.schema.createTable('favorites', (t) => {
      t.increments();
      t.integer('user_id').notNull().references('id').inTable('users').onDelete('CASCADE').index();
      t.integer('book_id').notNull().references('id').inTable('books').onDelete('CASCADE').index();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    });
  };

    exports.down = function(knex, Promise) {
    return knex.schema.dropTable('favorites');
    };
