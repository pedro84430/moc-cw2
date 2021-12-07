const mqtt = require('mqtt')
const {InfluxDB} = require('@influxdata/influxdb-client')

const host = 'mqtt'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`

// DB config parameters
const token = 'bM6kE0Y5pOSGMWrP_xaeuQd49sS9pCpxWcbj09uI5dY3Mx2trFnPIrFyLxu7Ue8JjYipbqjfg7Xr6zbz_280Iw=='
const org = 'MOC'
const bucket = 'iot-security'

// connect to mqtt broker
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
  })

const clientDB = new InfluxDB({url: 'http://db:8086', token: token})

const topic = 'security'

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})

client.on('message', (topic, payload) => {
  //TODO: Send Email Notification


  //TODO: Insert in DB Influx

  const {Point} = require('@influxdata/influxdb-client')
  const writeApi = clientDB.getWriteApi(org, bucket)
  writeApi.useDefaultTags({host: 'host1'})

  const point = new Point('mem').timestamp
  writeApi.writePoint(point)


  console.log('Received Message:', topic, payload.toString())
})


