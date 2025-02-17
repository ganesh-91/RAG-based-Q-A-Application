import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../documents/entities/document.entity';
import { KafkaService } from 'src/utils/kafka';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private kafkaService: KafkaService, // Use KafkaService instead of RabbitMQService
  ) {}

  async triggerIngestion(filePath: string) {
    // Simulate ingestion process
    console.log(`Ingesting document from path: ${filePath}`);
    // await this.kafkaService.sendMessage('ingestion-trigger', 'Ingestion triggered');

    // Send a message to Kafka
    // await this.kafkaService.sendMessage('ingestion-trigger', filePath);
    await this.kafkaService.triggerIngestion(filePath)

    return { message: 'Ingestion triggered successfully' };
  }

  async getIngestionStatus() {
    // Simulate getting ingestion status
    return { status: 'Ingestion in progress' };
  }
}