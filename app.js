const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs/promises')
const uploadsDir = path.join(__dirname, "uploads")
const avatarsDir = path.join(__dirname, "public", "avatars")

const authRouter = require('./routes/api/auth')
const contactsRouter = require('./routes/api/contacts')


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)

  },
  limits: {
    fileSize: 2048,
  }

})

const upload = multer({
  storage: multerConfig,
})

app.use('/api/users', authRouter)
app.use('/api/contacts', contactsRouter)

app.post('/api/upload', upload.single("image"), async (req, res, next) => {
  const { description } = req.body;
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(avatarsDir, originalname);
  try {
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }
  res.json({ description, message: 'Файл успешно загружен', status: 200 });
})

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
