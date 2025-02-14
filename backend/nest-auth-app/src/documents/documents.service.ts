import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ): Promise<Document> {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      filePath: file.path, // Save the file path
    });
    return this.documentsRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find();
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
