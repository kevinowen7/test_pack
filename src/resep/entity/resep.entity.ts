import {
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ResepDetailEntity } from '../../resep-detail/entity/resep-detail.entity';
import { ResepStatusEnum } from '../enum/resep.enum';

@Entity({ name: 'resep' })
export class ResepEntity {
    @PrimaryColumn({ name: 'id' })
    id: string;

    @Column({ name: 'patient_name' })
    patientName: string;

    @Column({ name: 'clinic_name' })
    clinicName: string;

    @Column({ name: 'doctor_name' })
    doctorName: string;

    @Column({ name: 'status', enum: ResepStatusEnum, default: ResepStatusEnum.CREATED })
    status: ResepStatusEnum;

    totalHarga?: number;

    @OneToMany(
        () => ResepDetailEntity,
        resepDetails => resepDetails.resep,
    )
    @JoinColumn({ name: 'id', referencedColumnName: 'resep_id' })
    resepDetails: ResepDetailEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
