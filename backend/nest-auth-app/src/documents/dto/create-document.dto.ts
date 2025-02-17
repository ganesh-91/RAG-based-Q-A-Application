export class CreateDocumentDto {
  title: string;
  filePath: string;
}

export class DocumentDto extends CreateDocumentDto {
  createdDate: Date;
  size: number;
  modifiedDate: Date;
}
