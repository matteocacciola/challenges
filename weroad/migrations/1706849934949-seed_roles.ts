import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../src/roles/roles.enums";

export class SeedRoles1706849934949 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "roles" (name) VALUES ('${Role.ADMIN}'), ('${Role.EDITOR}'), ('${Role.GUEST}');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE "roles" RESTART IDENTITY CASCADE`);
    }

}
