import { Module, Global } from '@nestjs/common';
import { OphimService } from './ophim.service';

@Global()
@Module({
  providers: [OphimService],
  exports: [OphimService],
})
export class OphimModule {}
