import {
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'obat' })
export class ObatEntity {
    @PrimaryColumn({ name: 'id' })
    id: string;

    @Column({ name: 'obat_name' })
    obatName: string;

    @Column({ name: 'sku' })
    sku: string;

    @Column({ name: 'price' })
    price: number;

    @Column({ name: 'konfigurasi_harga_id' })
    konfigurasiHargaId: number;

    @Column({ name: 'include_tax' })
    includeTax: boolean;

    @Column({ name: 'stock' })
    stock: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
