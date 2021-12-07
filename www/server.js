const mqtt = require('mqtt')
const {InfluxDB} = require('@influxdata/influxdb-client')

// MQTT parameters
const host = 'mqtt'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`

// DB config parameters
const token = 'e7pd0c271xFYoC91OlCHfimcKwghy0GkZAjmmQ1vmgUWIY2ew1oN_SEvfiUTJXCjjtJDiPAxqdxncKMj6eUWlg=='
const org = 'MOC'
const bucket = 'iot-security'

// connect to mqtt broker
const clientMQTT = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
  })

const clientDB = new InfluxDB({url: 'http://db:8086', token: token})
const {Point} = require('@influxdata/influxdb-client')
const writeApi = clientDB.getWriteApi(org, bucket)
const topic = 'security'

clientMQTT.on('connect', () => {
  console.log('Connected')
  clientMQTT.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})

clientMQTT.on('message', (topic, payload) => {


  

  //TODO: Send Email Notification


  //TODO: Insert in DB Influx

  const point = new Point('door_sensor').tag('door_id',"Kitchen Door").floatField("door_open",1.0)
  writeApi.writePoint(point)

  console.log('Received Message:', topic, payload.toString())

  //writeApi.close().then(() => console.log("api closed"))
})


