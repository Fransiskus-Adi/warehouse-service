import { MigrationInterface, QueryRunner } from "typeorm";

export class product1734252996317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE products (
                id varchar(36) PRIMARY KEY NOT NULL,
                name varchar(50) NOT NULL,
                price integer NOT NULL,
                qty integer NOT NULL,
                status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
                expDate datetime(6) NOT NULL,
                imageUrl varchar(255) NOT NULL,
                categoryId varchar(36),
                CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES category(id),
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            );`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE products
            `);
    }

}
