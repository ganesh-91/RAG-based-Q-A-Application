export class CreateDocumentDto {
  title: string;
  content: string;
  userId: number; // ID of the user who owns the document
}
