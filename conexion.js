const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3001;

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456789',
  database: 'almiron'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL: ', error);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

// Mostrar todos los datos
app.get('/', (req, res) => {
  connection.query('SELECT * FROM tabla_almiron', (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('index', { datos: resultados });
  });
});


app.get('/filtrar', (req, res) => {
  const consulta = 'SELECT tabla_almiron.columna1 AS nombre, tabla_almiron.columna2 AS edad, tabla_almiron.columna3 AS rol, peliculas.nombre AS nombre_pelicula, peliculas.tipo AS tipo_pelicula FROM tabla_almiron JOIN peliculas ON tabla_almiron.pelicula = peliculas.id';

  connection.query(consulta, (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('filtrar', { datos: resultados });
  });
});

// Mostrar formulario para agregar nuevo dato
app.get('/agregar', (req, res) => {
  res.render('agregar');
});

// Agregar un nuevo dato
app.post('/', (req, res) => {
  const nuevoDato = req.body;
  const consulta = 'INSERT INTO tabla_almiron (columna1, columna2, columna3, pelicula) VALUES (?, ?, ?, ?)';

  // Verificar que los campos requeridos no estén vacíos
  if (!nuevoDato.columna1 || !nuevoDato.columna2 || !nuevoDato.columna3 || !nuevoDato.pelicula) {
    res.render('agregar', { error: 'Todos los campos son requeridos' });
    return;
  }

  connection.query(consulta, [nuevoDato.columna1, nuevoDato.columna2, nuevoDato.columna3, nuevoDato.pelicula], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
      return;
    }
    console.log('Dato insertado exitosamente');
    res.redirect('/');
  });
});

// Mostrar formulario para editar un dato existente
app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'SELECT * FROM tabla_almiron WHERE id = ?';

  connection.query(consulta, [id], (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    if (resultados.length === 0) {
      res.redirect('/');
      return;
    }
    res.render('editar', { dato: resultados[0], error: null });
  });
});

// Actualizar un dato existente
app.post('/editar/:id', (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  const consulta = 'UPDATE tabla_almiron SET columna1 = ?, columna2 = ?, columna3 = ?, pelicula = ? WHERE id = ?';

  if (!datos.columna1 || !datos.columna2 || !datos.columna3 || !datos.pelicula) {
    res.render('editar', { error: 'Todos los campos son requeridos' });
    return;
  }

  connection.query(consulta, [datos.columna1, datos.columna2, datos.columna3, datos.pelicula, id], (error, results) => {
    if (error) {
      console.error('Error al actualizar datos: ', error);
      return;
    }
    console.log('Dato actualizado exitosamente');
    res.redirect('/');
  });
});

// Eliminar un dato
app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'DELETE FROM tabla_almiron WHERE id = ?';

  connection.query(consulta, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar el dato: ', error);
      return;
    }
    console.log('Dato eliminado exitosamente');
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
