import multer from 'multer';
import {GridFsStorage} from 'multer-gridfs-storage';
import path from "path";

const mongoURI = 'mongodb://localhost:27017/fantasy_tavern';

const storage = new GridFsStorage({
    url: mongoURI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return {
            filename: `file-${Date.now()}${path.extname(file.originalname)}`,
            bucketName: 'characterPhotos',
        };
    },
});

const upload = multer({ storage });
export default upload;
