
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', function(table) {
    table.increments('id');
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.integer('inventory').notNullable();
    table.decimal('price').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
}
