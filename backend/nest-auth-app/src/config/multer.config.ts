import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      // Define the path to the parent directory of the root folder
      const uploadPath = path.join(__dirname, '../../../upload');
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const filename = `${file.originalname}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Allow only doc, docx, and pdf files
    const allowedExtensions = ['.doc', '.docx', '.pdf'];
    const fileExt = extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
      callback(null, true); // Accept file
    } else {
      callback(
        new BadRequestException('Only .doc, .docx, and .pdf files are allowed!'),
        false,
      ); // Reject file
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
};
