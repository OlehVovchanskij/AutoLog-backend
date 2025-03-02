import { Response } from 'express';
import { AddCarDto } from './dto/add-car.dto';
import { AddCostDto } from './dto/add-cost.dto';
import { AddWarningDto } from './dto/add-warning.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthRequest } from './jwt-auth.guard';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(loginUserDto: LoginUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(req: AuthRequest, changePasswordDto: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    addCar(userId: string, addCarDto: AddCarDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCar(userId: string, updateCarDto: UpdateCarDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeCar(userId: string): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getCars(userId: string): Promise<import("./user.schema").Car | undefined>;
    createWarning(userId: string, addWarningDto: AddWarningDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeWarning(userId: string, warningId: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createCoast(userId: string, addCostDto: AddCostDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeCost(userId: string, costId: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
