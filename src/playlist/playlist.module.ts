import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist/playlist.controller';
import { RedirectService } from './playlist/redirect.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redirect } from './redirect.entity';

@Module({
  controllers: [PlaylistController],
  providers: [RedirectService],
  imports: [TypeOrmModule.forFeature([Redirect])],
})
export class PlaylistModule {}
