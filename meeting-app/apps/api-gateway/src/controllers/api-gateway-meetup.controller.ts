import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiGatewayMeetupService } from '../services/api-gateway-meetup.service';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { CreateMeetupDto } from 'libs/common/contracts/meetups/dtos/create-meetup.dto';

@ApiTags('meetup')
@Controller('meetup')
export class ApiGatewayMeetupController {
  constructor(private readonly apiGatewayMeetupService: ApiGatewayMeetupService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMeetupDto: CreateMeetupDto) {
    return this.apiGatewayMeetupService.create(createMeetupDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.apiGatewayMeetupService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string) {
    return this.apiGatewayMeetupService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.apiGatewayMeetupService.delete(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param('id') id: string, @Body() updateMeetupDto: UpdateMeetupDto) {
    return this.apiGatewayMeetupService.update(id, updateMeetupDto);
  }


}
