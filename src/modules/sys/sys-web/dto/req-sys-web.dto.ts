import { IsOptional, IsString } from 'class-validator';
import { DataBaseDto } from 'src/common/dto/data-base.dto';

export class AddSysWebDto extends DataBaseDto {
  /* 主题  */
  @IsOptional()
  @IsString()
  theme?: string;
}

export class UpdateSysWebDto extends DataBaseDto {}
