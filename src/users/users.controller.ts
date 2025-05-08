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
  @UseGuards(JwtAuthGuard)
  @Post('/car')
  async addCar(@Req() req: AuthRequest, @Body() dto: AddCarDto) {
    const userId = req.user?.userId as string;
    return this.usersService.addCar(userId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/car')
  async updateCar(@Req() req: AuthRequest, @Body() dto: UpdateCarDto) {
    const userId = req.user?.userId as string;
    return this.usersService.updateCar(userId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/car')
  async removeCar(@Req() req: AuthRequest) {
    const userId = req.user?.userId as string;
    return this.usersService.removeCar(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/car')
  async getCars(@Req() req: AuthRequest) {
    const userId = req.user?.userId as string;
    if (!userId) {
      console.log(req.user);
      throw new UnauthorizedException('User ID not found in request');
    }
    return this.usersService.getCar(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('/car/warnings')
  async createWarning(@Req() req: AuthRequest, @Body() dto: AddWarningDto) {
    const userId = req.user?.userId;
    return this.usersService.addWarning(userId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/car/warnings/:warningId')
  async removeWarning(
    @Req() req: AuthRequest,
    @Param('warningId') warningId: string,
  ) {
    const userId = req.user?.userId || '';
    return this.usersService.removeWarning(userId, warningId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('/car/costs')
  async createCost(@Req() req: AuthRequest, @Body() addCostDto: AddCostDto) {
    const userId = req.user?.userId;
    console.log(2);
    return this.usersService.addCost(userId, addCostDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/car/costs/:costId')
  async removeCost(@Req() req: AuthRequest, @Param('costId') costId: string) {
    const userId = req.user?.userId;
    return this.usersService.removeCost(userId, costId);
  }
  // Отримання конкретного автомобіля
  //   @Get(':userId/cars/:carId')
  //   async getCar(@Param('userId') userId: string, @Param('carId') carId: string) {
  //     return this.usersService.getCar(userId, carId);
  //   }
}
