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
        this.consumer = this.kafka.consumer({ groupId: 'nestjs-group' });
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'ingestion-trigger', fromBeginning: true });
        await this.consumer.subscribe({ topic: 'ingestion-status', fromBeginning: true });

        this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    topic,
                    partition,
                    value: message?.value?.toString(),
                });
            },
        });
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }

    async sendMessage(topic: string, path: string) {
        console.log('test')
        await this.producer.send({
            topic,
            messages:[
                {
                  // partition: event == "follower-update" ? 0 : 1,
                  key: "follower-update",
                  value: JSON.stringify({
                    id: 2,
                    email: "srijit29032001@gmail.com",
                    type: "FOLLOWER_UPDATE",
                    content: { name: "jhon doe" },
                  }),
                },
              ],
        });
    }
}