/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("user", (table)=>{
    table.increments('id').primary();
    table.string("username").notNullable();
    
  })
    .createTable("resume", (table)=>{
    table.increments('id').primary();
    table
        .integer("user_id")
        .unsigned()
        .references("user.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("role").notNullable();
    table.string("phone_number").notNullable();
    table.string("email").notNullable();
    table.string("summary").notNullable();
    table.string("skills").notNullable();
  })
  .createTable("link", (table)=>{
    table.increments('id').primary();
    table
        .integer("resume_id")
        .unsigned()
        .references("resume.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    table.string("link").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  })
  .createTable("education", (table)=>{
    table.increments('id').primary();
    table
        .integer("resume_id")
        .unsigned()
        .references("resume.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    table.string("title").notNullable();
    table.string("subtitle").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  })
  .createTable("experience", (table)=>{
    table.increments('id').primary();
    table
        .integer("resume_id")
        .unsigned()
        .references("resume.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    table.string("title").notNullable();
    table.string("subtitle").notNullable();
    table.string("bullet_points").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  })
  .createTable("project", (table)=>{
    table.increments('id').primary();
    table
        .integer("resume_id")
        .unsigned()
        .references("resume.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    table.string("title").notNullable();
    table.string("subtitle").notNullable();
    table.string("bullet_points").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("project")
        .dropTable("experience")
        .dropTable("education")
        .dropTable("link")
        .dropTable("resume")
        .dropTable("user");
};
