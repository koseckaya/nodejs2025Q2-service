import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { LoggingService } from 'src/logger/logger.service';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  findAll() {
    this.logger.verbose('[ArtistController] findAll called');
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(`[ArtistController] findOne called with id: ${id}`);
    return this.artistService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto) {
    this.logger.verbose(
      `[ArtistController] create called with data: ${JSON.stringify(createArtistDto)}`,
    );
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    this.logger.verbose(
      `[ArtistController] update called with id: ${id} and data: ${JSON.stringify(updateArtistDto)}`,
    );
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.verbose(`[ArtistController] remove called with id: ${id}`);
    await this.artistService.remove(id);
  }
}
