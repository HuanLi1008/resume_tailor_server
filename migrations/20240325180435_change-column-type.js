/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.alterTable('project', function(table) {
          table.text('bullet_points').alter();
        }),
        knex.schema.alterTable('experience', function(table) {
          table.text('bullet_points').alter();
        })
      ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return Promise.all([
        knex.schema.alterTable('project', function(table) {
          table.string('bullet_points', 255).alter();
        }),
        knex.schema.alterTable('experience', function(table) {
          table.string('bullet_points', 255).alter();
        })
      ]);
};
