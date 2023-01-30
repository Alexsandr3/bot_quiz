import { Module } from '@nestjs/common';
import { TestingController } from './testins.controller';
import { TestingService } from './testing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
