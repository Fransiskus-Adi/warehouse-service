import { MigrationInterface, QueryRunner } from "typeorm";

export class user1734252976674 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE users (
            id varchar(36) PRIMARY KEY NOT NULL,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            role varchar(16) NOT NULL,
            createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            deletedAt datetime(6) NULL,
            updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            )  
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE users
            `)
    }

}
