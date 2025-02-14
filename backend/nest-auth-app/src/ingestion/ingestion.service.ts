import { Injectable } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';

@Injectable()
export class IngestionService {
  @Client({
    transport: Transport.TCP,
    options: { host: 'python-backend', port: 3001 },
  })
  private client: ClientProxy;

  async triggerIngestion(): Promise<string> {
    const response = await this.client
      .send('trigger_ingestion', {})
      .toPromise();
    return response;
  }

  async getIngestionStatus(): Promise<string> {
    const response = await this.client
      .send('get_ingestion_status', {})
      .toPromise();
    return response;
  }
}
