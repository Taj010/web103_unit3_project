import express from 'express'
import { getAllLocations } from '../controllers/locationsController.js'

const router = express.Router()

router.get('/', async (_, res, next) => {
    try {
        const locations = await getAllLocations()
        res.json(locations)
    } catch (err) {
        next(err)
    }
})

export default router


