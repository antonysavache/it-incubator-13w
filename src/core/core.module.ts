import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { QueryParamsService } from './services/query-params.service';

@Module({
  providers: [EmailService, QueryParamsService],
  exports: [EmailService, QueryParamsService]
})
export class CoreModule {}