// Importación de Express y el módulo 'path' de Node.js
const express = require('express');
const path = require('path');

// Creación de una aplicación Express
const app = express();

// Definición del puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos (HTML, CSS, JavaScript) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor web iniciado en http://localhost:${PORT}/`);
});
