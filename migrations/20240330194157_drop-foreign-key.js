/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('resume', function(table) {
        
        table.dropForeign('user_id', 'resume_user_id_foreign');
        
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('resume', function(table) {
        
        table.integer('user_id').unsigned().references('id').inTable('user').alter();
        
      });
};
