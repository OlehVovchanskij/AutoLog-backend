import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AddCarDto } from './dto/add-car.dto';
import { AddCostDto } from './dto/add-cost.dto';
import { AddWarningDto } from './dto/add-warning.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthRequest, JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Реєстрація користувача
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  // Логін користувача
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const result = await this.usersService.login(loginUserDto, res);
    return res.status(HttpStatus.OK).json(result);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getProfile(@Req() req: AuthRequest, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('Користувач не знайдений');
    }
    const result = await this.usersService.getUserById(req.user.userId, res);
    return res.status(HttpStatus.OK).json(result);
  }

  // Зміна пароля
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: AuthRequest,
    @Body() changePasswordDto: { oldPassword: string; newPassword: string },
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Користувач не знайдений');
    }
    const result = this.usersService.changePassword(
      req.user.userId,
      changePasswordDto,
    );
    return result;
  }

  // Додавання автомобіля
  @Post(':userId/car')
  async addCar(@Param('userId') userId: string, @Body() addCarDto: AddCarDto) {
    return this.usersService.addCar(userId, addCarDto);
  }

  // Оновлення автомобіля
  @Put(':userId/car')
  async updateCar(
    @Param('userId') userId: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.usersService.updateCar(userId, updateCarDto);
  }

  // Видалення автомобіля
  @Delete(':userId/car/')
  async removeCar(@Param('userId') userId: string) {
    return this.usersService.removeCar(userId);
  }

  // Отримання всіх автомобілів користувача
  @Get(':userId/car')
  async getCars(@Param('userId') userId: string) {
    return this.usersService.getCar(userId);
  }

  @Post(':userId/car/warnings')
  async createWarning(
    @Param('userId') userId: string,
    @Body() addWarningDto: AddWarningDto,
  ) {
    return this.usersService.addWarning(userId, addWarningDto);
  }
  @Delete(':userId/car/warnings/:warningId')
  async removeWarning(
    @Param('userId') userId: string,
    @Param('warningId') warningId: string,
  ) {
    return this.usersService.removeWarning(userId, warningId);
  }

  @Post(':userId/car/costs')
  async createCoast(
    @Param('userId') userId: string,
    @Body() addCostDto: AddCostDto,
  ) {
    return this.usersService.addCost(userId, addCostDto);
  }
  @Delete(':userId/car/costs/:costId')
  async removeCost(
    @Param('userId') userId: string,
    @Param('costId') costId: string,
  ) {
    return this.usersService.removeCost(userId, costId);
  }
  // Отримання конкретного автомобіля
  //   @Get(':userId/cars/:carId')
  //   async getCar(@Param('userId') userId: string, @Param('carId') carId: string) {
  //     return this.usersService.getCar(userId, carId);
  //   }
}
