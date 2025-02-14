import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class IngestionService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  onModuleInit() {
    this.rabbitMQService.consumeMessages('ingestion-status', (message) => {
      console.log('Received ingestion status:', message);
    });
  }

  async getIngestionStatus() {
    return 'Ingestion status: In progress';
  }
}
