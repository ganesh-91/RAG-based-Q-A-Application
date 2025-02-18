import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Ingestion } from 'src/ingestion/entities/ingestion.entity';
import { IngestionService } from 'src/ingestion/ingestion.service';
import { IngestionModule } from 'src/ingestion/ingestion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Ingestion]), IngestionModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule { }
