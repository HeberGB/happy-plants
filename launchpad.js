const SerialPort = require('serialport')
const parsers = SerialPort.parsers
const path = require('path')
const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const port = process.env.PORT || 8000
const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
})

const parser = new parsers.Readline({
  delimiter: '\r\n'
})

const luanchpadPort = new SerialPort('COM3', {
  baudRate: 9700
})

luanchpadPort.pipe(parser)

luanchpadPort.on('open', () => console.log('Port open'))

parser.on('data', function(data){
})

io.on('connect', socket => {
  console.log(`Conectado ${socket.id}`)

  parser.on('data', function(data){
    socket.emit('agent/message', data)
  })
})