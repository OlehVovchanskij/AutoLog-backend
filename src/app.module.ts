import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Дозволяє доступ до конфігурації у всьому додатку
    }),
    MongooseModule.forRoot(
      `mongodb+srv://admin:${process.env.DB_PASS}@main.wezvu.mongodb.net/?retryWrites=true&w=majority&appName=main`,
    ),
    UsersModule,
  ],
})
export class AppModule {}
