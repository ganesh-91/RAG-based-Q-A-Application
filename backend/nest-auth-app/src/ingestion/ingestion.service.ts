import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from 'src/utils/kafka';
import { Ingestion } from './entities/ingestion.entity';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import * as path from 'path';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
    private kafkaService: KafkaService, // Use KafkaService instead of RabbitMQService
  ) {}

  async create(ingestion: CreateIngestionDto): Promise<Ingestion> {
    const user = this.ingestionRepository.create(ingestion);
    return this.ingestionRepository.save(ingestion);
  }

  async triggerIngestion(filePath: string) {
    console.log(`Ingesting document from path: ${filePath}`);
    await this.kafkaService.triggerIngestion(filePath);
    const fileName = path.basename(filePath);
    await this.create({
      fileName: fileName,
      filePath: filePath,
      ingestionDate: new Date(),
      ingestionCompleted: false,
    });

    return { message: 'Ingestion triggered successfully' };
  }

  async getIngestionStatus(id: number) {
    const ingestion = await this.ingestionRepository.findOne({ where: { id } });
    return {
      status: ingestion?.ingestionCompleted
        ? 'Ingestion completed'
        : 'Ingestion in progress',
    };
  }

  async updateIngestionStatus(fileName: string) {
    await this.ingestionRepository.update(
      { fileName: fileName },
      { ingestionCompleted: true },
    );
  }

  async findAll(): Promise<Ingestion[]> {
    return this.ingestionRepository.find();
  }

  // async triggerIngestionStatus(filename: string) {
  //   console.log(`Ingesting document from path: ${filename}`);
  //   await this.kafkaService.triggerIngestionUpdate(filename);
  //   return { message: 'Ingestion triggered successfully' };
  // }
}
