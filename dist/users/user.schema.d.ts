import { Document } from 'mongoose';
export declare class Warning extends Document {
    text: string;
    importance: string;
}
export declare const WarningSchema: import("mongoose").Schema<Warning, import("mongoose").Model<Warning, any, any, any, Document<unknown, any, Warning> & Warning & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Warning, Document<unknown, {}, import("mongoose").FlatRecord<Warning>> & import("mongoose").FlatRecord<Warning> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class Cost extends Document {
    type: string;
    cost: string;
}
export declare const CostSchema: import("mongoose").Schema<Cost, import("mongoose").Model<Cost, any, any, any, Document<unknown, any, Cost> & Cost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cost, Document<unknown, {}, import("mongoose").FlatRecord<Cost>> & import("mongoose").FlatRecord<Cost> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class Car {
    brand: string;
    modelName: string;
    engineVolume: string;
    year: number;
    driveType: string;
    mileage: number;
    lastOilChange: number;
    fuelConsumption: number;
    gearboxType: string;
    hoursePower: number;
    fuelType?: string;
    photo: string;
    warnings?: Warning[];
    costs?: Cost[];
}
export declare const CarSchema: import("mongoose").Schema<Car, import("mongoose").Model<Car, any, any, any, Document<unknown, any, Car> & Car & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Car, Document<unknown, {}, import("mongoose").FlatRecord<Car>> & import("mongoose").FlatRecord<Car> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class User extends Document {
    email: string;
    password: string;
    firstname: string;
    car?: Car;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
