import express from 'express'
import { getAllEvents, getEventsByLocationId } from '../controllers/eventsController.js'

const router = express.Router()

router.get('/', async (_, res, next) => {
    try {
        const events = await getAllEvents()
        res.json(events)
    } catch (err) {
        next(err)
    }
})

router.get('/location/:locationId', async (req, res, next) => {
    try {
        const events = await getEventsByLocationId(req.params.locationId)
        res.json(events)
    } catch (err) {
        next(err)
    }
})

export default router


