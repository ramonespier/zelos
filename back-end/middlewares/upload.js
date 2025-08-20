  import multer from 'multer';
import path from 'path';

// Define onde os arquivos serão armazenados
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // A pasta 'uploads' precisa existir na raiz do seu projeto back-end
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define um nome de arquivo único para evitar conflitos
    // Ex: 1678886400000-meu-arquivo.png
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de arquivo para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado! Apenas imagens são permitidas.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limite de 5 MB
  }
});

export default upload;