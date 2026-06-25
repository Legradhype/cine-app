import { UserRole } from '../enums/user-role.enum';
import { Reservation } from '../../reservations/entities/reservation.entity';
export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    reservations: Reservation[];
}
