exports.up = async (knex) => {
  await knex.schema
    .createTable('users', (users) => {
      users.increments('user_id')
      users.string('username', 200).notNullable()
      users.string('password', 200).notNullable()
    })
    .createTable('potlucks', table => {
      table.increments('potluck_id')
      table.string('potluck_name').notNullable()
      table.string('potluck_description')
      table.string('date').notNullable()
      table.string('time').notNullable()
      table.string('location').notNullable()
      table.integer('organizer')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT')
      table.boolean('public')
        .defaultTo(false)
        .notNullable()
    })
    .createTable('items', table => {
      table.increments('item_id')
      table.string('item_name').notNullable()
    })
    .createTable('potluck_items', table => {
      table.increments('potluck_item_id')
      table.integer('item_id')
        .unsigned()
        .notNullable()
        .references('item_id')
        .inTable('items')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT')
      table.integer('potluck_id')
        .unsigned()
        .notNullable()
        .references('potluck_id')
        .inTable('potlucks')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT')
      table.boolean('confirmed').defaultTo(false)
      table.integer('user_bringing')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT')
    })
    .createTable('potluck_users', table => {
      table.increments('potluck_user_id')
      table.integer('potluck_id')
        .unsigned()
        .notNullable()
        .references('potluck_id')
        .inTable('potlucks')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT')
      table.integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT')
      table.boolean('confirmed')
        .defaultTo(false)
    })

}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('potluck_users')
  await knex.schema.dropTableIfExists('potluck_items')
  await knex.schema.dropTableIfExists('items')
  await knex.schema.dropTableIfExists('potlucks')
  await knex.schema.dropTableIfExists('users')
}
