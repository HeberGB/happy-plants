require('chart.js')

const $ = require('jquery')

const addData = require('./functions/addData')
const removeData = require('./functions/removeData')


$(document).ready(function () {
  let ntcValue = 0
  let lm555Value = 0
  let yl69Value = 0

  function getNtcValue() {
    let ntcMetric = document.getElementById('NTCmetric')
    ntcMetric.innerHTML =
      `<h5>Voltaje</h5>
    ${ntcValue} volts
    <h5>Temperatura</h5>
    ${((ntcValue*888)/1000).toFixed(2)} °C`
  }

  function getLm555Value() {
    let lm555Metric = document.getElementById('LM555metric')
    let estado = 'Luces apagadas'
    if(lm555Value >= 0.01) estado = 'Luces encendidas'
    lm555Metric.innerHTML =
      `<h5>Voltaje</h5>
    ${lm555Value} volts
    <h5>Estado</h5>
    ${estado}`
  }

  function getYl69Value() {
    let yl69Metric = document.getElementById('YL69metric')
    let humedad = 'Seco'
    if(yl69Value <= 1.02){
      humedad = 'Muy mojada'
    } else if(yl69Value > 1.02 && yl69Value < 1.75) {
      humedad = 'Humeda'
    }
    yl69Metric.innerHTML =
      `<h5>Voltaje</h5>
    ${yl69Value} volts
    <h5>Estado</h5>
    ${humedad}`
  }

  var ctx = document.getElementById("NTCgraph").getContext('2d');
  var ctxlm = document.getElementById("LM555graph").getContext('2d');
  var ctxyl = document.getElementById("YL69graph").getContext('2d');

  var ntcChart = new Chart(ctx, {
    "type": "line",
    "data": {
      "datasets": [{
        "label": "Voltaje",
        "fill": false,
        "borderColor": "rgb(75, 192, 192)",
        "lineTension": 0.1
      }]
    },
    "options": {}
  })
  var lm555Chart = new Chart(ctxlm, {
    "type": "line",
    "data": {
      "datasets": [{
        "label": "Voltaje",
        "fill": false,
        "borderColor": "rgb(192, 40, 102)",
        "lineTension": 0.1
      }]
    },
    "options": {}
  })
  var yl69Chart = new Chart(ctxyl, {
    "type": "line",
    "data": {
      "datasets": [{
        "label": "Voltaje",
        "fill": false,
        "borderColor": "rgb(10, 192, 92)",
        "lineTension": 0.1
      }]
    },
    "options": {}
  })

  let i = 0
  let j = 0
  let k = 0
  var socket = io()
  socket.on('agent/message', function (payload) {
    console.log(payload)
    let uno = new RegExp('uno')
    let dos = new RegExp('dos')
    let tres = new RegExp('tres')
    if (uno.test(payload)) {
      ntcValue = payload.substring(4)
      if (i <= 10) {
        addData(ntcChart, `${i.toString()} seg`, ntcValue)
        getNtcValue()
      } else {
        addData(ntcChart, `${i.toString()} seg`, ntcValue)
        getNtcValue()
        removeData(ntcChart)
      }
      i++
    } else if (dos.test(payload)) {
      lm555Value = payload.substring(4)
      if (j <= 10) {
        addData(lm555Chart, `${i.toString()} seg`, lm555Value)
        getLm555Value()
      } else {
        addData(lm555Chart, `${i.toString()} seg`, lm555Value)
        getLm555Value()
        removeData(lm555Chart)
      }
      j++
    } else if (tres.test(payload)) {
      yl69Value = payload.substring(5)
      if (k <= 10) {
        addData(yl69Chart, `${i.toString()} seg`, yl69Value)
        getYl69Value()
      } else {
        addData(yl69Chart, `${i.toString()} seg`, yl69Value)
        getYl69Value()
        removeData(yl69Chart)
      }
      k++
    }
  })
})