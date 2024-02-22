import { MigrationInterface, QueryRunner } from "typeorm";
import {Role} from "../src/roles/roles.enums";

export class SeedAdmin1706857030446 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "users" (email, password)
            VALUES ('matteo.cacciola@gmail.com', '$2b$06$IqIhlXQaIy47G3PI2TO9yO/ThTza0T5fD/jNiUwTjV/.tydBuJFvC');`
        );

        const users = await queryRunner.query(`SELECT id from "users" WHERE email = 'matteo.cacciola@gmail.com'`);
        const userId = users[0].id;

        const roles = await queryRunner.query(`SELECT id from "roles" WHERE name = '${Role.ADMIN}'`);
        const roleId = roles[0].id;

        await queryRunner.query(`
            INSERT INTO "users_roles_roles" ("usersId", "rolesId")
            VALUES ('${userId}', ${roleId});`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE "users" CASCADE`);
    }

}
