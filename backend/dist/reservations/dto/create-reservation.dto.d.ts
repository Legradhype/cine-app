export declare class SeatDto {
    rowIndex: number;
    columnIndex: number;
}
export declare class CreateReservationDto {
    showtimeId: number;
    seats: SeatDto[];
}
