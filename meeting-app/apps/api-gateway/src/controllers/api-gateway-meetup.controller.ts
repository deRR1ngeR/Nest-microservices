import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { ApiGatewayMeetupService } from '../services/api-gateway-meetup.service';
import { UpdateMeetupDto } from 'apps/api-gateway/src/dtos/meetup/update-meetup.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';
import { RequestWithUser } from 'libs/common/contracts/account/interfaces/request-with-user.interface';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';
import { MeetupSearch } from 'libs/common/contracts/meetups/meetups.search';
import { CreateMeetupDto } from '../dtos/meetup/create-meetup.dto';
import { CreateMeetupResponse } from 'apps/api-gateway/responses/create-meetup.response';
import { Roles } from '../decorators/roles.decorator';
import { $Enums } from '@prisma/client';

@ApiTags('meetup')
@Controller('meetup')
export class ApiGatewayMeetupController {
  constructor(private readonly apiGatewayMeetupService: ApiGatewayMeetupService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeetupDto: CreateMeetupDto, @Req() req: RequestWithUser): Promise<Observable<CreateMeetupResponse>> {
    return this.apiGatewayMeetupService.create(createMeetupDto, +req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() position: MeetupGetPosition.Request = undefined): Promise<CreateMeetupResponse[]> {
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
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.apiGatewayMeetupService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles($Enums.Role.ORGANIZER, $Enums.Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMeetupDto: UpdateMeetupDto, @Req() req: RequestWithUser): Promise<Observable<MeetupUpdate.Response>> {
    return this.apiGatewayMeetupService.update(+id, updateMeetupDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('inviteUser/:meetupId')
  @HttpCode(HttpStatus.OK)
  async inviteUsers(@Param('meetupId', ParseIntPipe) meetupdId: number, @Query() email: AccountGetUserByEmail.Request, @Req() req: RequestWithUser) {
    return this.apiGatewayMeetupService.inviteUsers(meetupdId, email, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('deleteUser/:meetupId')
  @HttpCode(HttpStatus.OK)
  async deleteUserFromMeetup(@Param('meetupId', ParseIntPipe) meetupdId: number, @Query() email: AccountGetUserByEmail.Request, @Req() req: RequestWithUser) {
    return this.apiGatewayMeetupService.deleteUserFromMeetup(meetupdId, email, req.user.id);
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
  @Get('elastic')
  async searchMeetupsElastic(
    @Query() searchDto: MeetupSearch.MeetupSearchDto,
  ): Promise<Observable<MeetupSearch.Response[]>> {
    return this.apiGatewayMeetupService.findMeetupsWithElastic(searchDto);
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
  async findById(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id)
    return await this.apiGatewayMeetupService.findById(id);
  }
}