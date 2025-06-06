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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const add_car_dto_1 = require("./dto/add-car.dto");
const add_cost_dto_1 = require("./dto/add-cost.dto");
const add_warning_dto_1 = require("./dto/add-warning.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const update_car_dto_1 = require("./dto/update-car.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(createUserDto) {
        return this.usersService.register(createUserDto);
    }
    async login(loginUserDto, res) {
        const result = await this.usersService.login(loginUserDto, res);
        return res.status(common_1.HttpStatus.OK).json(result);
    }
    async getProfile(req, res) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('Користувач не знайдений');
        }
        const result = await this.usersService.getUserById(req.user.userId, res);
        return res.status(common_1.HttpStatus.OK).json(result);
    }
    async changePassword(req, changePasswordDto) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('Користувач не знайдений');
        }
        const result = this.usersService.changePassword(req.user.userId, changePasswordDto);
        return result;
    }
    async addCar(req, dto) {
        const userId = req.user?.userId;
        return this.usersService.addCar(userId, dto);
    }
    async updateCar(req, dto) {
        const userId = req.user?.userId;
        return this.usersService.updateCar(userId, dto);
    }
    async removeCar(req) {
        const userId = req.user?.userId;
        return this.usersService.removeCar(userId);
    }
    async getCars(req) {
        const userId = req.user?.userId;
        if (!userId) {
            console.log(req.user);
            throw new common_1.UnauthorizedException('User ID not found in request');
        }
        return this.usersService.getCar(userId);
    }
    async createWarning(req, dto) {
        const userId = req.user?.userId;
        return this.usersService.addWarning(userId, dto);
    }
    async removeWarning(req, warningId) {
        const userId = req.user?.userId || '';
        return this.usersService.removeWarning(userId, warningId);
    }
    async createCost(req, addCostDto) {
        const userId = req.user?.userId;
        console.log(2);
        return this.usersService.addCost(userId, addCostDto);
    }
    async removeCost(req, costId) {
        const userId = req.user?.userId;
        return this.usersService.removeCost(userId, costId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/car'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_car_dto_1.AddCarDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addCar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/car'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_car_dto_1.UpdateCarDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/car'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeCar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/car'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCars", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/car/warnings'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_warning_dto_1.AddWarningDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createWarning", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/car/warnings/:warningId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('warningId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeWarning", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/car/costs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_cost_dto_1.AddCostDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createCost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/car/costs/:costId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('costId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeCost", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map