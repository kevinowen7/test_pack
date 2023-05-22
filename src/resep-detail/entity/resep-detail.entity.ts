import {
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ResepEntity } from '../../resep/entity/resep.entity';

@Entity({ name: 'resep_detail' })
export class ResepDetailEntity {
    @PrimaryColumn({ name: 'id' })
    id: string;

    @Column({ name: 'resep_id' })
    resepId: string;

    @ManyToOne(
        () => ResepEntity,
        resep => resep.resepDetails,
    )
    @JoinColumn({ name: 'resep_id', referencedColumnName: 'id' })
    resep: ResepEntity;

    @Column({ name: 'obat_id' })
    obatId: string;

    @Column({ name: 'obatName' })
    obatName: string;

    @Column({ name: 'qty' })
    qty: number;

    @Column({ name: 'original_price' })
    originalPrice: number;

    @Column({ name: 'konfigurasi_harga_id' })
    konfigurasiHargaId: number;

    @Column({ name: 'include_tax' })
    includeTax: boolean;

    @Column({ name: 'final_price' })
    finalPrice: number;

    @Column({ name: 'total_price_obat' })
    totalPriceObat: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
