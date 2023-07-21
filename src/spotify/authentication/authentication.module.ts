import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { SharedHttpModule } from '../shared-http/shared-http.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../shared-http/config/configuration';

@Module({
  imports: [
    AuthenticationModule,
    SharedHttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
