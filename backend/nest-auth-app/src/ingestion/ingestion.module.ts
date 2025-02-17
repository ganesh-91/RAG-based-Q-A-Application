import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { KafkaService } from 'src/utils/kafka';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingestion])],
  controllers: [IngestionController],
  providers: [IngestionService, KafkaService],
  exports: [IngestionService],
})
export class IngestionModule {}
