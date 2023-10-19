import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { ApiGatewayMeetupService } from '../services/api-gateway-meetup.service';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';
import { RequestWithUser } from 'libs/common/contracts/account/interfaces/request-with-user.interface';
import { CreateMeetupDto } from 'libs/common/contracts/meetups/dtos/create-meetup.dto';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';

@ApiTags('meetup')
@Controller('meetup')
export class ApiGatewayMeetupController {
  constructor(private readonly apiGatewayMeetupService: ApiGatewayMeetupService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeetupDto: CreateMeetupDto, @Req() req: RequestWithUser): Promise<Observable<MeetupCreate.Response>> {
    return this.apiGatewayMeetupService.create(createMeetupDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() position: MeetupGetPosition.Request = undefined): Promise<MeetupCreate.Response[]> {
    return this.apiGatewayMeetupService.findAll(position)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getMyMeetups')
  @HttpCode(HttpStatus.OK)
  async findUserMeetups(@Req() req: RequestWithUser) {
    return this.apiGatewayMeetupService.findUserMeetups(+req.user.id)
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

  @UseGuards(JwtAuthGuard)
  @Get('inviteUser/:meetupId')
  @HttpCode(HttpStatus.OK)
  async inviteUsers(@Param('meetupId') meetupdId: number, @Query() email: AccountGetUserByEmail.Request, @Req() req: RequestWithUser) {
    return this.apiGatewayMeetupService.inviteUsers(meetupdId, email, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('deleteUser/:meetupId')
  @HttpCode(HttpStatus.OK)
  async deleteUserFromMeetup(@Param('meetupId') meetupdId: number, @Query() email: AccountGetUserByEmail.Request, @Req() req: RequestWithUser) {
    return this.apiGatewayMeetupService.deleteUserFromMeetup(meetupdId, email, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/generate-csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="meetups.csv"')
  async generateCsvReport(@Req() req: RequestWithUser) {
    const result = await this.apiGatewayMeetupService.generateCsv(+req.user.id);
    return new StreamableFile(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Conent-Disposition', 'attachment; filename="meetups.pdf"')
  async generatePdfReport(@Res({ passthrough: true }) res) {
    const buffer = await this.apiGatewayMeetupService.generatePdf()
    res.header({ 'Content-Length': buffer.length });
    res.send(buffer)
    return
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return await this.apiGatewayMeetupService.findById(id);

  }

}
