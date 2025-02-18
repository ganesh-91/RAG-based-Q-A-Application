import { forwardRef, Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { KafkaService } from 'src/utils/kafka';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';
import { AppModule } from 'src/app.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ingestion]), forwardRef(() => AppModule)],
  controllers: [IngestionController],
  providers: [IngestionService, KafkaService],
  exports: [IngestionService, KafkaService],
})
export class IngestionModule { }
