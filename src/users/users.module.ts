import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  CarSchema,
  CostSchema,
  UserSchema,
  WarningSchema,
} from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Car', schema: CarSchema },
      { name: 'Warning', schema: WarningSchema },
      { name: 'Cost', schema: CostSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService, JwtAuthGuard],
  controllers: [UsersController],
})
export class UsersModule {}
