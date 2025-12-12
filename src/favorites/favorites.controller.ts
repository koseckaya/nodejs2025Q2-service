import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { LoggingService } from 'src/logger/logger.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  findAll() {
    this.logger.verbose('[FavoritesController] findAll called');
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(`[FavoritesController] addTrack called with id: ${id}`);
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(
      `[FavoritesController] removeTrack called with id: ${id}`,
    );
    return this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(`[FavoritesController] addAlbum called with id: ${id}`);
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(
      `[FavoritesController] removeAlbum called with id: ${id}`,
    );
    return this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(
      `[FavoritesController] addArtist called with id: ${id}`,
    );
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(
      `[FavoritesController] removeArtist called with id: ${id}`,
    );
    return this.favoritesService.removeArtist(id);
  }
}
