import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed.'));
    }
  },
});

const router = Router();

router.post('/', upload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No image file uploaded.' });
    return;
  }

  const port = process.env.PORT || 5000;
  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

  res.status(200).json({
    message: 'Image imported successfully.',
    url: fileUrl,
    filename: req.file.filename,
  });
});

export default router;
