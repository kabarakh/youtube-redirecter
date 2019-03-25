import { Module } from '@nestjs/common';
import { AdministrationController } from './administration/administration.controller';

@Module({
  controllers: [AdministrationController]
})
export class AdministrationModule {}
