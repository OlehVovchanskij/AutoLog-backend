import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from './users.service';

export interface AuthRequest extends Request {
  user?: { userId: string }; // userId — це те, що ти передаєш у токені
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // Отримуємо access token з заголовка
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Неавторизований доступ');
    }

    const accessToken = authHeader.split(' ')[1];

    try {
      // Перевіряємо access token
      const decoded = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      request.user = { userId: decoded.userId };
      return true; // Повертаємо true, якщо токен валідний
    } catch (error) {
      // Якщо токен недійсний (наприклад, протух), спробуємо оновити його
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError'
      ) {
        const refreshToken = request.cookies?.refreshToken; // Отримуємо refresh token з cookies

        if (!refreshToken) {
          throw new UnauthorizedException('Refresh token не знайдено');
        }

        try {
          // Оновлюємо access token за допомогою refresh token
          const newAccessToken =
            await this.usersService.refreshAccessToken(refreshToken);

          // Оновлюємо заголовок Authorization з новим access token
          request.headers.authorization = `Bearer ${newAccessToken}`;

          // Перевіряємо новий access token
          const decoded = this.jwtService.verify(newAccessToken, {
            secret: process.env.JWT_SECRET,
          });
          request.user = { userId: decoded.userId };
          return true; // Повертаємо true, якщо новий токен валідний
        } catch (refreshError) {
          console.error('Помилка оновлення токена:', refreshError);
          throw new UnauthorizedException('Недійсний refresh token');
        }
      }

      // Інші помилки
      console.error('JWT Error:', error);
      throw new UnauthorizedException('Недійсний токен');
    }
  }
}
