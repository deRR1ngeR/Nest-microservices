import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsString, IsOptional, IsArray, IsDateString, IsDecimal } from 'class-validator';

export class CreateMeetupDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsArray()
    tags: string[];

    @ApiProperty()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsDecimal()
    longitude: Decimal;

    @ApiProperty()
    @IsDecimal()
    latitude: Decimal;
}