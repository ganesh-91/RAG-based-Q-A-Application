import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto, DocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Ingestion } from 'src/ingestion/entities/ingestion.entity';
import { CreateIngestionDto } from 'src/ingestion/dto/create-ingestion.dto';
import { IngestionService } from 'src/ingestion/ingestion.service';

@Injectable()
export class DocumentsService {
  filePath: string;
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
    private readonly ingestionService: IngestionService,
  ) {
    this.filePath = path.join(__dirname, '../../../upload');
  }

  async create(file: Express.Multer.File): Promise<null> {
    return null;
  }

  async ingestDocument(file: CreateIngestionDto) {
    return await this.ingestionService.triggerIngestion(file);
  }

  async findAll(): Promise<(DocumentDto | undefined)[]> {
    try {
      const files = await fs.promises.readdir(this.filePath);

      const fileDetails = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(this.filePath, filename);
          const stats = await fs.promises.stat(filePath);
          if (!stats.isDirectory()) {
            return {
              title: filename,
              filePath: filePath,
              size: stats.size,
              createdDate: stats.birthtime,
              modifiedDate: stats.mtime,
            };
          }
        }),
      );

      return fileDetails;
    } catch (error) {
      throw new Error(`Failed to read directory: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Document | null> {
    return this.documentsRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document | null> {
    await this.documentsRepository.update(id, updateDocumentDto);
    return this.documentsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.documentsRepository.delete(id);
  }
}
