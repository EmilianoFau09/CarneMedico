/* Configuracion del servidor *////////////////////////////////////////////////
import express from 'express';
require('dotenv').config()

const app = express()
app.use(express.json())

const cors = require('cors');

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE"
};

app.use(cors(corsOptions));

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

////////////////////////////////////////////////////////////////////////////////


/* Base de datos *//////////////////////////////////////////////////////////////
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  database: 'Obligatorio',
  port: 3306,
  user: 'root',
  password: '1234',
});

connection.connect((err: any) => {
  if (err) throw err;
  console.log('Conectado a la base de datos.');
});

///////////////////////////////////////////////////////////////////////////////////


/* BCrypt *////////////////////////////////////////////////////////////////////////
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    throw error;
  }
}

async function comparePassword(inputPassword: string, hashedPassword: string) {
  try {
    const match = await bcrypt.compare(inputPassword, hashedPassword);
    return match;
  } catch (error) {
    // Manejo de errores
    console.error('Error al comparar las contraseñas:', error);
    throw error;
  }
}

///////////////////////////////////////////////////////////////////////////////////


/* Email */////////////////////////////////////////////////////////////////////////

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL, // Email
    pass: process.env.PASS // Codigo de verificacion(al verificar en dos pasos)
  }
});
// Contra mail: HOLAmundo1

function createMailOptions(from: any, to: any, subject: any, text: any) {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text
  };
  return mailOptions;
}



///////////////////////////////////////////////////////////////////////////////////


/* Operaciones CRUD *//////////////////////////////////////////////////////////////

app.post('/loguearUsuario', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM Usuarios WHERE Usuario = '${username}'`;

    connection.query(query, async (err: any, results: any) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).send({ message: 'Error en el servidor' });
        return;
      }
      if (results.length > 0) {
        const match = await comparePassword(password, results[0]['Contraseña']);
        if (match) {
          res.status(200).send({ message: "Usuario encontrado." });
        } else {
          res.status(400).send({ message: "Contraseña incorrecta." });
        }
      } else {
        res.status(400).send({ message: 'Usuario incorrecto.' });
      }
    });
  } catch (error) {
    console.error('Error inesperado: ' + error);
    res.status(500).send({ message: 'Error en el servidor' });
  }
});

app.post('/loguearAdmin', async (req, res) => {

})


app.post('/registrarUsuario', (req, res) => {
  try {
    console.log('blob', req.body.imagenCarne);
    
    const username = req.body.username;
    let password = req.body.password;
    const ci = req.body.ci;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const fechaNacimiento = req.body.fechaNacimiento;
    const domicilio = req.body.domicilio;
    const correo = req.body.correo;
    const telefono = req.body.telefono
    const tieneCarne = req.body.tieneCarne;
    const fechaEmisionCarne = req.body.fechaEmisionCarne;
    const fechaVencimientoCarne = req.body.fechaVencimientoCarne;
    const imagenCarne = req.body.imagenCarne;
    const fechaAgenda = req.body.fechaAgenda;

    // Verificar Usuario
    const query1 = `SELECT * FROM Usuarios WHERE Usuario = ?`;
    connection.query(query1, [username], async (err: any, results: any) => {
      console.log("Verificando usuario.");
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).send({ message: 'Error en el servidor' });
      }
      else if (results.length > 0) {
        res.status(400).send({ message: "Nombre de usuario existente." });
      }
      else {
        // Verificar Funcionario
        const query2 = `SELECT * FROM Funcionarios WHERE Ci = ?`;
        connection.query(query2, [ci], async (err: any, results: any) => {
          console.log("Verificando funcionario.");
          if (err) {
            console.error('Error al ejecutar la consulta: ' + err);
            res.status(500).send({ message: 'Error en el servidor' });
          }
          else if (results.length > 0) {
            res.status(400).send({ message: "Cedula registrada." });
          }
          else {
            // Añadir usuario a la tabla
            password = await hashPassword(password);
            const query3 = `INSERT INTO Usuarios(Usuario, Contraseña) VALUES (?, ?)`;
            connection.query(query3, [username, password], async (err: any, results: any) => {
              console.log("Insertando usuario.");
              if (err) {
                console.error('Error al ejecutar la consulta: ' + err);
                res.status(500).send({ message: 'Error en el servidor' });
              }
            })

            // Añadir funcionarios a la tabla
            const query4 = `INSERT INTO Funcionarios(Ci, Nombre, Apellido, Fecha_Nacimiento, Direccion, Telefono, Email, Usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(query4, [ci, nombre, apellido, fechaNacimiento, domicilio, telefono, correo, username], async (err: any, results: any) => {
              console.log("Insertando funcionario.");
              if (err) {
                console.error('Error al ejecutar la consulta: ' + err);
                res.status(500).send({ message: 'Error en el servidor' });
              }
            })

            if (tieneCarne) {
              // Añadir carnet de salud a la tabla
              const query5 = `INSERT INTO Carnet_Salud(Ci, Fecha_Emision, Fecha_Vencimiento, Comprobante) VALUES (?, ?, ?, ?)`;
              connection.query(query5, [ci, fechaEmisionCarne, fechaVencimientoCarne, imagenCarne], async (err: any, results: any) => {
                console.log("Insertando carnet de salud.");
                console.log(ci, fechaEmisionCarne, fechaVencimientoCarne, imagenCarne);

                if (err) {
                  console.error('Error al ejecutar la consulta: ' + err);
                  res.status(500).send({ message: 'Error en el servidor' });
                }
                if (results) {
                  res.status(200).send({ message: 'Usuario añadido con exito.' });
                }
              })
            } else {
              // Añadir agenda a la tabla
              const query5 = `INSERT INTO Agenda(Ci, Fecha_Agenda) VALUES (?, ?)`;
              connection.query(query5, [ci, fechaAgenda], async (err: any, results: any) => {
                console.log("Insertando agenda");
                if (err) {
                  console.error('Error al ejecutar la consulta: ' + err);
                  res.status(500).send({ message: 'Error en el servidor' });
                }
                if (results) {
                  res.status(200).send({ message: 'Usuario añadido con exito y agendado.' });
                }
              })
            }
          }
        })
      }
    })
  } catch (error) {
    console.error('Error inesperado: ' + error);
    res.status(500).send({ message: 'Error en el servidor' });
  }
});





app.post('/actualizarUsuario', (req, res) => {
  try {
    const ci = req.body.ci;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const fechaNacimiento = req.body.fechaNacimiento;
    const tieneCarne = req.body.tieneCarne;
    const fechaEmisionCarne = req.body.fechaEmisionCarne;
    const fechaVencimientoCarne = req.body.fechaVencimientoCarne;
    const imagenCarne = req.body.imagenCarne;
    const fechaAgenda = req.body.fechaAgenda;
    const password = req.body.password;

    // Verificar Funcionario
    const query1 = `SELECT * FROM Funcionarios F INNER JOIN Usuarios U ON U.Usuario=F.Usuario WHERE Ci = ?`;
    connection.query(query1, [ci], async (err: any, results: any) => {
      console.log("Verificando funcionario.");
      const match = await comparePassword(password, results[0]['Contraseña']);
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).send({ message: 'Error en el servidor' });
      }
      else if (results.length > 0) {
        if (match) {
          // Actualizar datos funcionario en la tabla
          const query2 = 'UPDATE Funcionarios SET Nombre = ?, Apellido = ?, Fecha_Nacimiento = ? WHERE Ci = ?;';
          connection.query(query2, [nombre, apellido, fechaNacimiento, ci], async (err: any, results: any) => {
            console.log("Actualizando funcionario.");
            if (err) {
              console.error('Error al ejecutar la consulta: ' + err);
              res.status(500).send({ message: 'Error en el servidor' });
            }
          })
          if (tieneCarne) {
            // Verificar Carnet_Salud
            const query3 = `SELECT * FROM Carnet_Salud WHERE Ci = ?`;
            connection.query(query3, [ci], async (err: any, results: any) => {
              console.log("Verificando carnet salud.");
              if (err) {
                console.error('Error al ejecutar la consulta: ' + err);
                res.status(500).send({ message: 'Error en el servidor' });
              }
              if (results.length > 0) {
                // Actualizar carne salud
                const query4 = 'UPDATE Carnet_Salud SET Fecha_Emision = ?, Fecha_Vencimiento = ?, Comprobante = ? WHERE Ci = ?;';
                connection.query(query4, [fechaEmisionCarne, fechaVencimientoCarne, imagenCarne, ci], async (err: any, results: any) => {
                  console.log("Actualizando carnet de salud..");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                  if (results) {
                    res.status(200).send({ message: 'Usuario actualizado con exito.' });
                  }
                })
              } else {
                // Añadir carnet de salud a la tabla
                const query5 = `INSERT INTO Carnet_Salud(Ci, Fecha_Emision, Fecha_Vencimiento, Comprobante) VALUES (?, ?, ?, ?)`;
                connection.query(query5, [ci, fechaEmisionCarne, fechaVencimientoCarne, imagenCarne], async (err: any, results: any) => {
                  console.log("Insertando carnet de salud.");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                  if (results) {
                    // Borra datos de Agenda
                    const query6 = `DELETE FROM Agenda WHERE Ci = ?`;
                    connection.query(query6, [ci], async (err: any, results: any) => {
                      console.log("Borrando Agenda.");
                      if (err) {
                        console.error('Error al ejecutar la consulta: ' + err);
                        res.status(500).send({ message: 'Error en el servidor' });
                      }
                    })
                    res.status(200).send({ message: 'Usuario actualizado con exito.' });
                  }
                })
              }
            })
          } else {
            // Verificar Agenda
            const query6 = `SELECT * FROM Agenda WHERE Ci = ?`;
            connection.query(query6, [ci], async (err: any, results: any) => {
              console.log("Verificando Agenda.");
              if (err) {
                console.error('Error al ejecutar la consulta: ' + err);
                res.status(500).send({ message: 'Error en el servidor' });
              }
              if (results.length > 0) {
                // Actualizar Agenda
                const query7 = 'UPDATE Agenda SET Fecha_Agenda = ? WHERE Ci = ?;';
                connection.query(query7, [fechaAgenda, ci], async (err: any, results: any) => {
                  console.log("Actualizando agenda");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                  if (results) {
                    res.status(200).send({ message: 'Usuario actualizado con exito.' });
                  }
                })
              } else {
                // Añadir agenda a la tabla
                const query8 = `INSERT INTO Agenda(Ci, Fecha_Agenda) VALUES (?, ?)`;
                connection.query(query8, [ci, fechaAgenda], async (err: any, results: any) => {
                  console.log("Insertando agenda");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                  if (results) {
                    // Borra datos de Carne de salud
                    const query9 = `DELETE FROM Carnet_Salud WHERE Ci = ?`;
                    connection.query(query9, [ci], async (err: any, results: any) => {
                      console.log("Borrando carnet de salud.");
                      if (err) {
                        console.error('Error al ejecutar la consulta: ' + err);
                        res.status(500).send({ message: 'Error en el servidor' });
                      }
                    })
                    res.status(200).send({ message: 'Usuario actualizado con exito.' });
                  }
                })
              }
            })
          }
        } else {
          res.status(400).send({ message: 'No le cambies datos a los demas.' });
        }
      } else {
        res.status(400).send({ message: 'Cedula incorrecta.' });
      }
    })
  } catch (error) {
    console.error('Error inesperado: ' + error);
    res.status(500).send({ message: 'Error en el servidor' });
  }
});



app.get('/obtenerFechaAgenda', async (req, res) => {
  try {
    const query10 = `SELECT Fecha_Inicio, Fecha_Fin FROM Periodo_Agenda WHERE Año = ?`; // agarrar datos 

    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();

    connection.query(query10, [añoActual], async (err: any, results: any) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).send({ message: 'Error en el servidor' });
        return;
      }

      if (results.length > 0) {
        console.log("Fecha encontrada.");

        const fechaInicio = new Date(results[0].Fecha_Inicio);
        const fechaFin = new Date(results[0].Fecha_Fin);

        res.status(200).send({ fechaInicio: fechaInicio, fechaFin: fechaFin });
      } else {
        res.status(400).send({ message: 'No se encontraron datos para el año actual.' });
      }
    });
  } catch (error) {
    console.error('Error inesperado: ' + error);
    res.status(500).send({ message: 'Error en el servidor' });
  }
});


app.get('/obtenerFechaActualizacion', async (req, res) => {
  try {
    const query11 = `SELECT Fecha_Inicio, Fecha_Fin FROM Periodos_Actualizacion WHERE Año = ?`; // agarrar datos 

    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();

    connection.query(query11, [añoActual], async (err: any, results: any) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).send({ message: 'Error en el servidor' });
        return;
      }

      if (results.length > 0) {
        const fechaInicio = new Date(results[0].Fecha_Inicio);
        const fechaFin = new Date(results[0].Fecha_Fin);

        res.status(200).send({ fechaInicio: fechaInicio, fechaFin: fechaFin });
      } else {
        res.status(400).send({ message: 'No se encontraron datos para el año actual.' });
      }
    });
  } catch (error) {
    console.error('Error inesperado: ' + error);
    res.status(500).send({ message: 'Error en el servidor' });
  }
});


function todosLosDias() {
  const query12 = `SELECT F.Email, A.Fecha_Agenda FROM Agenda A JOIN Funcionarios F ON A.Ci = F.Ci JOIN Usuarios U ON F.Usuario = U.Usuario`;
  connection.query(query12, [], async (err: any, results: any) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ' + err);
      return;
    }
    if (results.length > 0) {
      console.log('Verificar agendados.');
      let listaUsuariosEnAgenda: any[] = results;
      listaUsuariosEnAgenda.forEach((e) => {
        const dia = e.Fecha_Agenda.getDate();
        const mes = e.Fecha_Agenda.getMonth() + 1;
        const año = e.Fecha_Agenda.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        const mailOptions = createMailOptions('pepeapestoso309@gmail.com', e.Email, 'Agenda', `Recuerde que esta agendados para hacerse el carne de salud el dia ${fechaFormateada}.`);
        transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Correo enviado: ' + info.response);
          }
        });
      })
    }
  });
  const fechaActual = new Date();
  const query13 = `SELECT F.Email FROM Carnet_Salud CS JOIN Funcionarios F ON CS.Ci = F.Ci JOIN Usuarios U ON F.Usuario = U.Usuario WHERE CS.Fecha_Vencimiento < ?`;
  connection.query(query13, [fechaActual], async (err: any, results: any) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ' + err);
      return;
    }
    if (results.length > 0) {
      console.log('Verificar vencidos.');
      let listaUsuariosVecidos: any[] = results;
      listaUsuariosVecidos.forEach((e) => {
        const mailOptions = createMailOptions('pepeapestoso309@gmail.com', e.Email, 'Carne salud', 'Recuerde que su carne de salud esta vencido.');
        transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Correo enviado: ' + info.response);
          }
        });
      })
    }
  });
}

const intervaloDias = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
setInterval(todosLosDias, intervaloDias);


app.post('/sesionAdmin', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM Admin WHERE Usuario = ?`;

    connection.query(query, [username], async (err: any, results: any) => {
      console.log('Logueando admin.');
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).send({ message: 'Error en el servidor' });
        return;
      }
      if (results.length > 0) {
        const match = password === results[0]['Contraseña'];
        if (match) {
          res.status(200).send({ message: "Admin encontrado." });
        } else {
          res.status(400).send({ message: "Contraseña incorrecta." });
        }
      } else {
        res.status(400).send({ message: 'Admin incorrecto.' });
      }
    });
  } catch (error) {
    console.error('Error inesperado: ' + error);
    res.status(500).send({ message: 'Error en el servidor' });
  }
})

app.post('/actualizarDatosAdmin', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const añoAgenda = req.body.añoAgenda;
    const fechaInicioAgenda = req.body.fechaInicioAgenda;
    const fechaFinAgenda = req.body.fechaFinAgenda;
    const añoActualizacion = req.body.añoActualizacion;
    const fechaInicioActualizacion = req.body.fechaInicioActualizacion;
    const fechaFinActualizacion = req.body.fechaFinActualizacion;
    const cambiarAgenda = req.body.cambiarAgenda;
    const cambiarActualizacion = req.body.cambiarActualizacion;

    const query = `SELECT * FROM Admin WHERE Usuario = ?`;
    connection.query(query, [username], async (err: any, results: any) => {
      console.log('Logueando admin.');
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).send({ message: 'Error en el servidor' });
        return;
      }
      if (results.length > 0) {
        const match = password === results[0]['Contraseña'];
        if (match) {
          // Agenda
          if (cambiarAgenda) {
            const query6 = `SELECT * FROM Periodo_Agenda WHERE Año = ?`;
            connection.query(query6, [añoAgenda], async (err: any, results: any) => {
              console.log("Verificando Periodo_Agenda.");
              if (err) {
                console.error('Error al ejecutar la consulta: ' + err);
                res.status(500).send({ message: 'Error en el servidor' });
              }
              if (results.length > 0) {
                const query7 = 'UPDATE Periodo_Agenda SET Fecha_Inicio = ?, Fecha_Fin = ? WHERE Año = ?;';
                connection.query(query7, [fechaInicioAgenda, fechaFinAgenda, añoAgenda], async (err: any, results: any) => {
                  console.log("Actualizando Periodo_Agenda");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                })
              } else {
                const query8 = `INSERT INTO Periodo_Agenda(Año, Fecha_Inicio, Fecha_Fin) VALUES (?, ?, ?)`;
                connection.query(query8, [añoAgenda, fechaInicioAgenda, fechaFinAgenda], async (err: any, results: any) => {
                  console.log("Insertando Periodo_Agenda");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                })
              }
            })
          }
          // Periodo actualizacion
          if (cambiarActualizacion) {
            const query6 = `SELECT * FROM Periodos_Actualizacion WHERE Año = ?`;
            connection.query(query6, [añoActualizacion], async (err: any, results: any) => {
              console.log("Verificando Periodos_Actualizacion.");
              if (err) {
                console.error('Error al ejecutar la consulta: ' + err);
                res.status(500).send({ message: 'Error en el servidor' });
              }
              if (results.length > 0) {
                const query7 = 'UPDATE Periodos_Actualizacion SET Fecha_Inicio = ?, Fecha_Fin = ? WHERE Año = ?;';
                connection.query(query7, [fechaInicioActualizacion, fechaFinActualizacion, añoActualizacion], async (err: any, results: any) => {
                  console.log("Actualizando Periodos_Actualizacion");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                })
              } else {
                const query8 = `INSERT INTO Periodos_Actualizacion(Año, Fecha_Inicio, Fecha_Fin) VALUES (?, ?, ?)`;
                connection.query(query8, [añoActualizacion, fechaInicioActualizacion, fechaFinActualizacion], async (err: any, results: any) => {
                  console.log("Insertando Periodos_Actualizacion");
                  if (err) {
                    console.error('Error al ejecutar la consulta: ' + err);
                    res.status(500).send({ message: 'Error en el servidor' });
                  }
                })
              }
            })
          }
          res.status(200).send({ message: "Datos actualizados con exito." });
        } else {
          res.status(400).send({ message: "Contraseña incorrecta." });
        }
      } else {
        res.status(400).send({ message: 'Admin incorrecto.' });
      }
    });
  } catch (error) {
    console.error('Error inesperado: ' + error);
    res.status(500).send({ message: 'Error en el servidor' });
  }
})



// npm run dev

