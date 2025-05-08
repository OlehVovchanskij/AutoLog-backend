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
    addCar(req: AuthRequest, dto: AddCarDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCar(req: AuthRequest, dto: UpdateCarDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeCar(req: AuthRequest): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getCars(req: AuthRequest): Promise<import("./user.schema").Car | undefined>;
    createWarning(req: AuthRequest, dto: AddWarningDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeWarning(req: AuthRequest, warningId: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createCost(req: AuthRequest, addCostDto: AddCostDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeCost(req: AuthRequest, costId: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
