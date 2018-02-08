// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'shopping_user',
      password : 'password',
      database : 'shopping_database',
      charset: 'utf8'
    },
    debug: true,
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    // seeds: {
    //   directory: __dirname + '/knex/seeds'
    // }
  }
}