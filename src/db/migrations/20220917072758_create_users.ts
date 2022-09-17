import { AbstractMigration, Info, ClientPostgreSQL } from "../../deps.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
    /** Runs on migrate */
    async up(info: Info): Promise<void> {
        await this.client.queryObject(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username character varying(50) NOT NULL,
          password character varying(100) NOT NULL,
          eoa character varying(50) NOT NULL,
          email character varying(355) NOT NULL,
          created_on timestamp without time zone default now(),
          last_login timestamp without time zone
      );
    `);
    }

    /** Runs on rollback */
    async down(info: Info): Promise<void> {
        await this.client.queryObject(`
            DROP table users
        `);
    }
}
