import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { PlaylistModule } from './playlist/playlist.module';
import { AdministrationModule } from './administration/administration.module';


@Module({
  imports: [PlaylistModule, TypeOrmModule.forRoot(), AdministrationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
