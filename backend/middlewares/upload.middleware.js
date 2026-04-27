import multer  from "multer";

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;