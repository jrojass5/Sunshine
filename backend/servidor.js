const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Servidor backend en funcionamiento 🚀');
});

app.get('/productos', (req, res) => {
  const rutaArchivo = path.join(__dirname, 'productos.json');

  if (!fs.existsSync(rutaArchivo)) {
    return res.status(200).json([]); 
  }

  try {
    const datos = fs.readFileSync(rutaArchivo, 'utf-8');
    const productos = JSON.parse(datos);
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al leer productos:', error);
    res.status(500).json({ mensaje: 'Error al leer los productos.', error });
  }
});

app.post('/guardar-producto', upload.single('imagen'), (req, res) => {
  try {
    const { id, nombre, especie } = req.body;
    const variedades = JSON.parse(req.body.variedades || '[]');
    const gradosCalidad = JSON.parse(req.body.gradosCalidad || '[]');
    const imagen = req.file ? req.file.filename : null;

    const producto = {
      id,
      nombre,
      especie,
      variedades,
      gradosCalidad,
      imagen
    };

    const rutaArchivo = path.join(__dirname, 'productos.json');
    let productos = [];

    if (fs.existsSync(rutaArchivo)) {
      const datos = fs.readFileSync(rutaArchivo, 'utf-8');
      productos = JSON.parse(datos);
    }

    productos.push(producto);
    fs.writeFileSync(rutaArchivo, JSON.stringify(productos, null, 2));

    res.status(200).json({ mensaje: 'Producto almacenado exitosamente.', producto });
  } catch (error) {
    console.error('Error al guardar producto:', error);
    res.status(500).json({ mensaje: 'Error al guardar el producto.', error });
  }
});

app.use((err, req, res, next) => {
  console.error(' Error no controlado:', err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
  console.log(` Servidor backend escuchando en http://localhost:${PORT}`);
});