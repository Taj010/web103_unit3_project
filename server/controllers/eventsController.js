import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getDataPath = (filename) => path.join(__dirname, '../data', filename)

export const getAllEvents = async () => {
    try {
        const [eventsData, locationsData] = await Promise.all([
            JSON.parse(fs.readFileSync(getDataPath('events.json'), 'utf8')),
            JSON.parse(fs.readFileSync(getDataPath('locations.json'), 'utf8'))
        ])
        
        // Join events with location data
        return eventsData.map(event => {
            const location = locationsData.find(loc => loc.id === event.location_id)
            return {
                ...event,
                location_name: location ? location.name : 'Unknown Location',
                location_image: location ? location.image : null
            }
        })
    } catch (error) {
        console.error('Error reading events data:', error)
        return []
    }
}

export const getEventsByLocationId = async (locationId) => {
    try {
        const eventsData = JSON.parse(fs.readFileSync(getDataPath('events.json'), 'utf8'))
        return eventsData.filter(event => event.location_id === parseInt(locationId))
    } catch (error) {
        console.error('Error reading events data:', error)
        return []
    }
}

export default { getAllEvents, getEventsByLocationId }


