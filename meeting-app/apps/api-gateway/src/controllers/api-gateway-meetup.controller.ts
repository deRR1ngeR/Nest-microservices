import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiGatewayMeetupService } from '../services/api-gateway-meetup.service';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { Observable } from 'rxjs';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';

@ApiTags('meetup')
@Controller('meetup')
export class ApiGatewayMeetupController {
  constructor(private readonly apiGatewayMeetupService: ApiGatewayMeetupService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeetupDto: MeetupCreate.Request): Promise<Observable<MeetupCreate.Response>> {
    return this.apiGatewayMeetupService.create(createMeetupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() position: MeetupGetPosition.Request): Promise<MeetupCreate.Response[]> {
    return this.apiGatewayMeetupService.findAll(position)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return this.apiGatewayMeetupService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: MeetupDelete.Request) {
    return this.apiGatewayMeetupService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id') id: string, @Body() updateMeetupDto: UpdateMeetupDto): Promise<Observable<MeetupUpdate.Response>> {
    return this.apiGatewayMeetupService.update(id, updateMeetupDto);
  }
}
