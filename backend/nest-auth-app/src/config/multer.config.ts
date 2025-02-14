import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads', // Files will be saved in the 'uploads' folder
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Add file filter logic here if needed (e.g., allow only images)
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
};
