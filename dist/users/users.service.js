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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose_2 = require("mongoose");
const customError_1 = require("../customError");
const user_schema_1 = require("./user.schema");
let UsersService = class UsersService {
    constructor(userModel, carModel, carWarningModel, costModel, jwtService) {
        this.userModel = userModel;
        this.carModel = carModel;
        this.carWarningModel = carWarningModel;
        this.costModel = costModel;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        const { email, password, firstname } = createUserDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Адруса уже використовується');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            email,
            password: hashedPassword,
            firstname,
        });
        await newUser.save();
        return newUser;
    }
    async login(loginUserDto, res) {
        const { email, password } = loginUserDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Неправильна адреса або пароль');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Неправильна адреса або пароль');
        }
        const payload = { userId: user._id, email: user.email };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return {
            access_token: accessToken,
            user: user,
        };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_SECRET,
            });
            const newAccessToken = this.jwtService.sign({ userId: decoded.userId }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
            return newAccessToken;
        }
        catch (error) {
            console.error('Помилка оновлення токена:', error);
            throw new common_1.UnauthorizedException('Недійсний refresh token');
        }
    }
    async getUserById(userId, res) {
        const user = await this.userModel
            .findById(userId)
            .select('-password')
            .exec();
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        const payload = { userId: user._id, email: user.email };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return {
            access_token: accessToken,
            user: user,
        };
    }
    async changePassword(userId, changePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Incorrect old password');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return { message: 'Password updated successfully' };
    }
    async addCar(userId, addCarDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.car) {
            throw new customError_1.CustomError('Машина уже додана');
        }
        user.car = addCarDto;
        await user.save();
        return user;
    }
    async updateCar(userId, updateCarDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const car = await user.car;
        if (!car) {
            throw new common_1.NotFoundException('Машину не знайдено');
        }
        Object.assign(car, updateCarDto);
        await user.save();
        return user;
    }
    async removeCar(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.car = undefined;
        user.save();
        return { message: 'Car removed successfully', user };
    }
    async getCar(userId) {
        const user = await this.userModel.findById(userId).populate('car');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.car;
    }
    async addWarning(userId, addWarningDto) {
        const user = await this.userModel.findById(userId).exec();
        if (!user?.car) {
            throw new common_1.NotFoundException('Автомобіль не знайдено');
        }
        const warning = new this.carWarningModel(addWarningDto);
        if (!user.car.warnings) {
            user.car.warnings = [];
        }
        user.car.warnings.push(warning);
        user.markModified('car.warnings');
        await user.save();
        return user;
    }
    async removeWarning(userId, warningId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.car || !user.car.warnings) {
            throw new common_1.NotFoundException('Користувач або автомобіль не знайдено');
        }
        user.car.warnings = user.car.warnings.filter((item) => item._id != warningId);
        user.markModified('car.warnings');
        await user.save();
        return user;
    }
    async addCost(userId, addCostDto) {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.car) {
            throw new common_1.NotFoundException('Користувач або автомобіль не знайдено');
        }
        if (!user.car.costs) {
            user.car.costs = [];
        }
        const cost = new this.costModel(addCostDto);
        user.car.costs.push(cost);
        user.markModified('car.costs');
        await user.save();
        return user;
    }
    async removeCost(userId, costId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.car) {
            throw new common_1.NotFoundException('Користувач або автомобіль не знайдено');
        }
        user.car.costs = user.car.costs?.filter((item) => item._id != costId);
        user.car.costs?.map((item) => console.log(item._id + '\t' + costId));
        user.markModified('car.costs');
        await user.save();
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.Car.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.Warning.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.Cost.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map