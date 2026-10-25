import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // תיקיית היעד אליה יישמרו התמונות
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const bookCode = req.params.code || req.body.code || 'book';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);

        cb(null, `${bookCode}_${timestamp}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimeType.startWith('images/')) {
        cb(null, true)
    } else {
        cb(new Error("file must be image type!", false));
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: fileFilter
});