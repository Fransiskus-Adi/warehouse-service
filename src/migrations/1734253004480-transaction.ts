import { MigrationInterface, QueryRunner } from "typeorm";

export class transaction1734253004480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE transactions(
                id varchar(36) PRIMARY KEY NOT NULL,
                customerName varchar(255) NOT NULL,
                customerPhone varchar(255) NOT NULL,
                transactionCode varchar(255) NOT NULL,
                transactionPlatform varchar(255) NOT NULL,
                totalItem integer NOT NULL,
                subTotal integer NOT NULL,
                totalPrice integer NOT NULL,
                status ENUM('onGoing', 'complete', 'cancel') NOT NULL DEFAULT 'onGoing',
                transactionDate datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                userId varchar(36),
                CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id),
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            );`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE transactions`
        )
    }

}
