import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { UserRole } from '../shared/constants';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async triggerIngestion() {
    return this.ingestionService.triggerIngestion();
  }

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async getIngestionStatus() {
    return this.ingestionService.getIngestionStatus();
  }
}
