import { MigrationInterface, QueryRunner } from "typeorm";

export class transactionItem1734253009329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE transactionItems (
                id varchar(36) PRIMARY KEY NOT NULL,
                qty integer NOT NULL,
                price integer NOT NULL,
                transactionId varchar(36),
                CONSTRAINT fk_transaction FOREIGN KEY (transactionId) REFERENCES transactions(id),
                productId varchar(36),
                CONSTRAINT fk_product FOREIGN KEY (productId) REFERENCES products(id),
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            )`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE transaction-items`
        )
    }

}
