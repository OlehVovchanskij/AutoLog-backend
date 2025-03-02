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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("./users.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Неавторизований доступ');
        }
        const accessToken = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(accessToken, {
                secret: process.env.JWT_SECRET,
            });
            request.user = { userId: decoded.userId };
            return true;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError' ||
                error.name === 'JsonWebTokenError') {
                const refreshToken = request.cookies?.refreshToken;
                if (!refreshToken) {
                    throw new common_1.UnauthorizedException('Refresh token не знайдено');
                }
                try {
                    const newAccessToken = await this.usersService.refreshAccessToken(refreshToken);
                    request.headers.authorization = `Bearer ${newAccessToken}`;
                    const decoded = this.jwtService.verify(newAccessToken, {
                        secret: process.env.JWT_SECRET,
                    });
                    request.user = { userId: decoded.userId };
                    return true;
                }
                catch (refreshError) {
                    console.error('Помилка оновлення токена:', refreshError);
                    throw new common_1.UnauthorizedException('Недійсний refresh token');
                }
            }
            console.error('JWT Error:', error);
            throw new common_1.UnauthorizedException('Недійсний токен');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map