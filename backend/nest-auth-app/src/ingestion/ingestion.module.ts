import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { KafkaService } from 'src/utils/kafka';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/documents/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [IngestionController],
  providers: [IngestionService, KafkaService],
})
export class IngestionModule {}
