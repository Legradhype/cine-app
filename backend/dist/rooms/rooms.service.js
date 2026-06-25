"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
let RoomsService = class RoomsService {
    constructor(roomsRepository) {
        this.roomsRepository = roomsRepository;
    }
    async create(createRoomDto) {
        const existing = await this.roomsRepository.findOne({
            where: { name: createRoomDto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Ya existe una sala con ese nombre.');
        }
        const room = this.roomsRepository.create(createRoomDto);
        return this.roomsRepository.save(room);
    }
    async findAll() {
        return this.roomsRepository.find({ order: { name: 'ASC' } });
    }
    async findOne(id) {
        const room = await this.roomsRepository.findOne({ where: { id } });
        if (!room) {
            throw new common_1.NotFoundException('La sala seleccionada no existe.');
        }
        return room;
    }
    async update(id, updateRoomDto) {
        const room = await this.findOne(id);
        if (updateRoomDto.name && updateRoomDto.name !== room.name) {
            const existing = await this.roomsRepository.findOne({
                where: { name: updateRoomDto.name },
            });
            if (existing) {
                throw new common_1.ConflictException('Ya existe una sala con ese nombre.');
            }
        }
        Object.assign(room, updateRoomDto);
        return this.roomsRepository.save(room);
    }
    async remove(id) {
        const room = await this.findOne(id);
        await this.roomsRepository.remove(room);
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map