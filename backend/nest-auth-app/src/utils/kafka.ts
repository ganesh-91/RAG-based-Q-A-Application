import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;

    constructor() {
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
        await this.consumer.subscribe({ topic: 'ingestion-trigger', fromBeginning: true });
        await this.consumer.subscribe({ topic: 'ingestion-completed', fromBeginning: true });

        this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (topic === 'ingestion-completed') {
                    console.log('Ingestion completed:', message?.value?.toString());
                }
            },
        });
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }

    async triggerIngestion(filepath: string) {
        await this.producer.send({
            topic: 'ingestion-trigger',
            messages: [
                {
                    key: 'document-ingestion',
                    value: filepath, // Send the file path as the message value
                },
            ],
        });
        console.log(`Triggered ingestion for file: ${filepath}`);
    }
}