
exports.seed = async function(knex) {
    await knex('potluck_users').insert([
      {
        potluck_id: 1,
        user_id: 1
      },
      {
        potluck_id: 1,
        user_id: 2,
        confirmed: true
      }
    ]);
  };
  