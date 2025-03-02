import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { CustomError } from 'src/customError';
import { AddCarDto } from './dto/add-car.dto';
import { AddCostDto } from './dto/add-cost.dto';
import { AddWarningDto } from './dto/add-warning.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, Cost, User, Warning } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Car.name) private carModel: Model<Car>,
    @InjectModel(Warning.name) private carWarningModel: Model<Warning>,
    @InjectModel(Cost.name) private costModel: Model<Cost>,

    private readonly jwtService: JwtService,
  ) {}

  // Реєстрація користувача
  async register(createUserDto: CreateUserDto) {
    const { email, password, firstname } = createUserDto;

    // Перевірка, чи існує користувач
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('Адруса уже використовується');
    }

    // Шифрування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      firstname,
    });

    await newUser.save();
    return newUser;
  }

  // Логін користувача
  async login(loginUserDto: LoginUserDto, res: Response) {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Неправильна адреса або пароль');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Неправильна адреса або пароль');
    }

    const payload = { userId: user._id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Використовувати тільки з HTTPS
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    return {
      access_token: accessToken,
      user: user,
    };
  }
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Перевіряємо refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      // Генеруємо новий access token
      const newAccessToken = this.jwtService.sign(
        { userId: decoded.userId },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );

      return newAccessToken;
    } catch (error) {
      console.error('Помилка оновлення токена:', error);
      throw new UnauthorizedException('Недійсний refresh token');
    }
  }
  async getUserById(userId: string, res: Response) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();

    if (!user) throw new NotFoundException('Користувача не знайдено');
    const payload = { userId: user._id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Використовувати тільки з HTTPS
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });
    return {
      access_token: accessToken,
      user: user,
    };
  }
  // Зміна пароля
  async changePassword(
    userId,
    changePasswordDto: {
      oldPassword: string;
      newPassword: string;
    },
  ) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userModel.findOne({ _id: userId }); // Логіка для поточного користувача

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  // Додавання автомобіля
  async addCar(userId: string, addCarDto: AddCarDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.car) {
      throw new CustomError('Машина уже додана');
    }

    user.car = addCarDto;
    await user.save();
    return user;
  }

  // Оновлення автомобіля
  async updateCar(userId: string, updateCarDto: UpdateCarDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const car = await user.car;
    if (!car) {
      throw new NotFoundException('Машину не знайдено');
    }

    Object.assign(car, updateCarDto);
    await user.save();
    return user;
  }

  // Видалення автомобіля
  async removeCar(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.car = undefined;
    user.save();
    return { message: 'Car removed successfully', user };
  }

  // Отримання всіх автомобілів користувача
  async getCar(userId: string) {
    const user = await this.userModel.findById(userId).populate('car');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.car;
  }

  // Отримання конкретного автомобіля
  // async getCar(userId: string, carId: string) {
  //   const user = await this.userModel.findById(userId).populate('cars');
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const car = await user.cars.find(({ _id }) => {
  //     if (_id instanceof Types.ObjectId) {
  //       return _id.toString() == carId;
  //     }
  //   });
  //   if (!car) {
  //     throw new NotFoundException('Car not found');
  //   }

  //   return car;
  // }
  async addWarning(userId, addWarningDto: AddWarningDto) {
    // Знаходимо користувача за userId
    const user = await this.userModel.findById(userId).exec();
    if (!user?.car) {
      throw new NotFoundException('Автомобіль не знайдено');
    }

    // Створюємо нове попередження
    const warning = new this.carWarningModel(addWarningDto);

    // Перевіряємо, чи існує масив warnings
    if (!user.car.warnings) {
      user.car.warnings = []; // Якщо масив відсутній, створюємо його
    }

    // Додаємо нове попередження до масиву warnings
    user.car.warnings.push(warning);

    // Позначаємо, що масив warnings змінився
    user.markModified('car.warnings');

    // Зберігаємо оновленого користувача в базі даних
    await user.save();

    // Повертаємо оновленого користувача
    return user;
  }
  async removeWarning(userId, warningId) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.car || !user.car.warnings) {
      throw new NotFoundException('Користувач або автомобіль не знайдено');
    }
    user.car.warnings = user.car.warnings.filter(
      (item) => item._id != warningId,
    );
    user.markModified('car.warnings');
    await user.save();
    return user;
  }
  async addCost(userId, addCostDto: AddCostDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.car) {
      throw new NotFoundException('Користувач або автомобіль не знайдено');
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
      throw new NotFoundException('Користувач або автомобіль не знайдено');
    }
    user.car.costs = user.car.costs?.filter((item) => item._id != costId);
    user.car.costs?.map((item) => console.log(item._id + '\t' + costId));
    user.markModified('car.costs');
    await user.save();
    return user;
  }
}
