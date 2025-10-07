import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getDataPath = (filename) => path.join(__dirname, '../data', filename)

export const getAllLocations = async () => {
    try {
        const data = fs.readFileSync(getDataPath('locations.json'), 'utf8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading locations data:', error)
        return []
    }
}

export default { getAllLocations }


