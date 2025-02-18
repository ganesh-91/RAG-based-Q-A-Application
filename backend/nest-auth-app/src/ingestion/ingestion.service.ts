import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from 'src/utils/kafka';
import { Ingestion } from './entities/ingestion.entity';
import { CreateIngestionDto } from './dto/create-ingestion.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
    @Inject(forwardRef(() => KafkaService)) // Use forwardRef to resolve circular dependency
    private kafkaService: KafkaService,
  ) { }

  async create(ingestion: CreateIngestionDto): Promise<Ingestion> {
    const user = this.ingestionRepository.create(ingestion);
    return this.ingestionRepository.save(ingestion);
  }

  async triggerIngestion(file: CreateIngestionDto) {
    await this.kafkaService.triggerIngestion(file.filePath);
    const ingestion = await this.ingestionRepository.create({
      fileName: file.fileName,
      filePath: file.filePath,
      ingestionCompleted: false,
      ingestionDate: new Date()
    });
    await this.ingestionRepository.save(ingestion);

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

}
