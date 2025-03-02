import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Model } from 'mongoose';
import { AddCarDto } from './dto/add-car.dto';
import { AddCostDto } from './dto/add-cost.dto';
import { AddWarningDto } from './dto/add-warning.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, Cost, User, Warning } from './user.schema';
export declare class UsersService {
    private userModel;
    private carModel;
    private carWarningModel;
    private costModel;
    private readonly jwtService;
    constructor(userModel: Model<User>, carModel: Model<Car>, carWarningModel: Model<Warning>, costModel: Model<Cost>, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(loginUserDto: LoginUserDto, res: Response): Promise<{
        access_token: string;
        user: import("mongoose").Document<unknown, {}, User> & User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    refreshAccessToken(refreshToken: string): Promise<string>;
    getUserById(userId: string, res: Response): Promise<{
        access_token: string;
        user: import("mongoose").Document<unknown, {}, User> & User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    changePassword(userId: any, changePasswordDto: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    addCar(userId: string, addCarDto: AddCarDto): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCar(userId: string, updateCarDto: UpdateCarDto): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeCar(userId: string): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, User> & User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getCar(userId: string): Promise<Car | undefined>;
    addWarning(userId: any, addWarningDto: AddWarningDto): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeWarning(userId: any, warningId: any): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    addCost(userId: any, addCostDto: AddCostDto): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeCost(userId: any, costId: any): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
