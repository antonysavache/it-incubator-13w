import { Global, Module } from '@nestjs/common';
import { QueryParamsService } from './services/query-params.service';

@Global()
@Module({
  providers: [QueryParamsService],
  exports: [QueryParamsService],
})
export class CoreModule {}
