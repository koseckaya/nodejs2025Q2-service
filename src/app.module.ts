import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [DataModule, UserModule, TrackModule],
})
export class AppModule {}
