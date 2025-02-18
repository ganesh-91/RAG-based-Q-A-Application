import { Injectable, OnModuleInit, OnModuleDestroy, Inject, forwardRef } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { IngestionService } from 'src/ingestion/ingestion.service';
import * as path from 'path';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    @Inject(forwardRef(() => IngestionService))
    private readonly ingestionService: IngestionService,
  ) {
    this.kafka = new Kafka({
      clientId: 'nestjs-kafka',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'nest-consumer-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'ingestion-trigger',
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: 'ingestion-completed',
      fromBeginning: true,
    });

    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (topic === 'ingestion-completed') {
          const fileName = path.basename(message?.value?.toString() || '');
          this.ingestionService.updateIngestionStatus(fileName || '');
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async triggerIngestion(fileName: string) {
    await this.producer.send({
      topic: 'ingestion-trigger',
      messages: [
        {
          key: 'document-ingestion',
          value: fileName,
        },
      ],
    });
  }

}
