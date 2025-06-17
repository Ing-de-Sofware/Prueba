import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './interfaces/controllers/profile.controller';
import { ProfileService } from './application/services/profile.service';
import { SupabaseProfileRepository } from './infrastructure/repositories/supabase-profile.repository';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

export const PROFILE_REPOSITORY = 'PROFILE_REPOSITORY';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [
    {
      provide: PROFILE_REPOSITORY,
      useClass: SupabaseProfileRepository,
    },
    {
      provide: ProfileService,
      useFactory: (repository, authService) => new ProfileService(repository, authService),
      inject: [PROFILE_REPOSITORY, AuthService],
    },
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfilesModule {}