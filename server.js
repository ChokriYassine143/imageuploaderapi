const express = require("express");
const multer = require('multer');
const sharp = require('sharp');
const axios = require('axios');
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use('/uploaded-images', express.static('uploads'));
const cors = require('cors');


app.use(cors({
  origin: '*', 
  credentials: true 
}));
app.post('/uploadimage', upload.single('image'), async (req, res) => {
    try {
      let inputImageBuffer;
  
      if (req.file) {
        inputImageBuffer = req.file.buffer;
      } else if (req.body.imageUrl) {
        const response = await axios.get(req.body.imageUrl, { responseType: 'arraybuffer' });
        inputImageBuffer = Buffer.from(response.data, 'binary');
      } else {
        return res.status(400).json({ error: 'No image provided.' });
      }
      const editedImageFilename = `${Date.now()}.jpg`;
      const editedImagePath = `uploads/${editedImageFilename}`;
      await sharp(inputImageBuffer)
        .resize(300, 300)
        .toFile(editedImagePath);
      
      // Serve the edited image URL
      const editedImageUrl = `/uploaded-images/${editedImageFilename}`;
  
      return res.status(200).json({ editedImageUrl });
    } catch (error) {
      console.error('Error editing image:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  });
  

  

   
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
