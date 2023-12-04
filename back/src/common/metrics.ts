import Prometheus from 'prom-client'
import express from 'express'
import { GlobalEnv } from './env'

const collectDefaultMetrics = Prometheus.collectDefaultMetrics
const prefix = 'enderbot_'

export const route_request_duration_seconds = new Prometheus.Histogram({
    name: 'app_route_request_duration_seconds',
    help: 'Duration of requests to the server in seconds',
    labelNames: ['route'],
})

export const database_query_duration_seconds = new Prometheus.Histogram({
    name: 'app_route_query_duration_seconds',
    help: 'Duration of queries to the database in seconds',
    labelNames: ['type', 'entity'],
})


export async function startMetricsServer() {
    const app = express()
    const port = Number(GlobalEnv.PROMETHEUS_PORT)

    app.get('/metrics', async (req, res) => {
        console.log('Metrics requested')
        Prometheus.register.clear()
        collectDefaultMetrics({ prefix })
        Prometheus.register.registerMetric(route_request_duration_seconds)
        Prometheus.register.registerMetric(database_query_duration_seconds)
        res.set('Content-Type', Prometheus.register.contentType)
        res.end(await Prometheus.register.metrics())
    })
    app.listen(port, 'localhost', () => {
        console.log(`Metrics server listening at http://localhost:${port}/metrics`)
    })
}
