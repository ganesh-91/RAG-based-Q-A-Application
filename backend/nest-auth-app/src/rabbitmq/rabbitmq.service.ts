// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as amqp from 'amqplib';

// @Injectable()
// export class RabbitMQService implements OnModuleInit {
//   private connection: amqp.Connection;
//   private channel: amqp.Channel;

//   async onModuleInit() {
//     this.connection = await amqp.connect('amqp://localhost');
//     this.channel = await this.connection.createChannel();

//     // Declare queues
//     await this.channel.assertQueue('ingestion-trigger');
//     await this.channel.assertQueue('ingestion-status');
//   }

//   async sendMessage(queue: string, message: string) {
//     this.channel.sendToQueue(queue, Buffer.from(message));
//   }

//   async consumeMessages(queue: string, callback: (message: string) => void) {
//     await this.channel.consume(queue, (msg) => {
//       if (msg) {
//         const message = msg.content.toString();
//         callback(message);
//         this.channel.ack(msg);
//       }
//     });
//   }
// }

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private isInitialized: Promise<void>; // Add a promise to track initialization

  constructor() {
    // Initialize the promise in the constructor
    this.isInitialized = this.initializeConnection();
  }

  private async initializeConnection() {
    // Separate initialization function
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();

    // Declare queues (important to do this *after* channel creation)
    await this.channel.assertQueue('ingestion-trigger');
    await this.channel.assertQueue('ingestion-status');
  }

  async onModuleInit() {
    // Await the initialization promise
    await this.isInitialized;
    console.log('RabbitMQ initialized'); // Confirmation (optional)
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  async sendMessage(queue: string, message: string) {
    await this.isInitialized; // Ensure initialization before sending
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async consumeMessages(queue: string, callback: (message: string) => void) {
    await this.isInitialized; // Ensure initialization before consuming

    this.channel.consume(queue, (msg) => {
      // No need for 'await' here
      if (msg) {
        const message = msg.content.toString();
        callback(message);
        this.channel.ack(msg);
      }
    });
  }
}
