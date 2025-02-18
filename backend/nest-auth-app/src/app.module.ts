import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { DocumentsModule } from './documents/documents.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { Document } from './documents/entities/document.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { KafkaService } from './utils/kafka';
import { Ingestion } from './ingestion/entities/ingestion.entity';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Path to your .env file (optional, defaults to .env in root)
      isGlobal: true, // Makes the config available globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || ''),
      username: process.env.DB_USERNAME,
      password: `${process.env.DB_PASSWORD}`,
      database: process.env.DB_DATABASE,
      entities: [User, Document, Ingestion],
      synchronize: true,
      ssl: false,
    }),
    UsersModule,
    AuthModule,
    DocumentsModule,
    forwardRef(() => IngestionModule),
  ],
  providers: [KafkaService],
  controllers: [HealthController],
})
export class AppModule {}
