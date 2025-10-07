import { pool } from './database.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import process from 'process'

// Load .env from project root regardless of CWD
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Log basic target info (no secrets)
console.log('DB Host:', process.env.PGHOST)
console.log('DB Name:', process.env.PGDATABASE)

// Global error handlers for visibility
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason)
})
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

const createTables = async () => {
    console.log('🔧 Creating tables...')
    console.log(' - Acquiring DB client...')
    const client = await pool.connect()
    console.log(' - DB client acquired')
    try {
        console.log(' - BEGIN transaction')
        await client.query('BEGIN')
        console.log(' - Dropping tables if exist')
        await client.query('DROP TABLE IF EXISTS events')
        await client.query('DROP TABLE IF EXISTS locations')

        console.log(' - Creating table: locations')
        await client.query(`
            CREATE TABLE IF NOT EXISTS locations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                city VARCHAR(100) NOT NULL,
                state VARCHAR(20) NOT NULL,
                zip VARCHAR(20) NOT NULL,
                image TEXT NOT NULL
            )
        `)

        console.log(' - Creating table: events')
        await client.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                time VARCHAR(32) NOT NULL,
                image TEXT NOT NULL
            )
        `)

        console.log(' - COMMIT transaction')
        await client.query('COMMIT')
        console.log('🎉 Tables created successfully')
        const { rows } = await client.query('select current_database() db')
        console.log('Using DB:', rows[0].db)
    } catch (err) {
        await client.query('ROLLBACK')
        console.error('⚠️ Error creating tables:', err)
        throw err
    } finally {
        console.log(' - Releasing DB client')
        client.release()
    }
}

const locationsData = [
    {
        name: 'Seoul Nights Rooftop',
        address: '123 Starview Ave',
        city: 'Seoul',
        state: 'KR',
        zip: '04524',
        image: 'https://placehold.co/800x400?text=Seoul+Nights+Rooftop'
    },
    {
        name: 'Han River Hideaway',
        address: '88 Riverside Rd',
        city: 'Seoul',
        state: 'KR',
        zip: '04000',
        image: 'https://placehold.co/800x400?text=Han+River+Hideaway'
    },
    {
        name: 'Drama High School',
        address: '77 Cherry Blossom Ln',
        city: 'Seoul',
        state: 'KR',
        zip: '03000',
        image: 'https://placehold.co/800x400?text=Drama+High+School'
    },
    {
        name: 'The Neighborhood Café',
        address: '12 Cozy Street',
        city: 'Seoul',
        state: 'KR',
        zip: '02500',
        image: 'https://placehold.co/800x400?text=Neighborhood+Cafe'
    },
    {
        name: 'Spirit Realm Shrine',
        address: '9 Moonlit Path',
        city: 'Seoul',
        state: 'KR',
        zip: '02020',
        image: 'https://placehold.co/800x400?text=Spirit+Realm+Shrine'
    }
]

const eventsByLocation = {
    1: [
        { title: 'Rooftop confession karaoke night', date: '2025-10-15', time: '8:00 PM', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=center' },
        { title: 'Midnight ramen cook-off', date: '2025-10-20', time: '11:30 PM', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&crop=center' },
        { title: 'K-Drama OST listening lounge', date: '2025-11-02', time: '7:30 PM', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=center' },
        { title: '"City Lights" photo contest', date: '2025-11-10', time: '6:00 PM', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center' },
        { title: 'Rewrite-the-ending fan fiction workshop', date: '2025-11-18', time: '5:00 PM', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center' },
        { title: 'Rooftop drama reenactment night', date: '2025-11-25', time: '8:30 PM', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&crop=center' }
    ],
    2: [
        { title: 'Couple\'s picnic cosplay meetup', date: '2025-10-12', time: '2:00 PM', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center' },
        { title: 'Umbrella-sharing photo challenge', date: '2025-10-19', time: '4:00 PM', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&crop=center' },
        { title: 'Flashback film screenings', date: '2025-10-26', time: '6:30 PM', image: 'https://images.unsplash.com/photo-1489599808420-5b1b2a0b3b3b?w=600&h=400&fit=crop&crop=center' },
        { title: '"Lost Letter" scavenger hunt', date: '2025-11-03', time: '3:00 PM', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center' },
        { title: 'Sketch & sip riverside art session', date: '2025-11-09', time: '5:00 PM', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center' },
        { title: 'Anonymous admirer message board', date: '2025-11-16', time: 'All Day', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center' }
    ],
    3: [
        { title: 'Uniform-themed dance party', date: '2025-10-14', time: '7:00 PM', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center' },
        { title: 'Secret admirer note exchange', date: '2025-10-21', time: '12:00 PM', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center' },
        { title: 'Drama trivia showdown', date: '2025-10-28', time: '6:00 PM', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&crop=center' },
        { title: 'Talent show: "Sing like the Second Lead"', date: '2025-11-06', time: '7:30 PM', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=center' },
        { title: '"Best Love Triangle" debate night', date: '2025-11-13', time: '8:00 PM', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&crop=center' },
        { title: 'K-Drama classroom roleplay', date: '2025-11-20', time: '5:30 PM', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center' }
    ],
    4: [
        { title: 'Latte art workshops', date: '2025-10-11', time: '10:00 AM', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&crop=center' },
        { title: 'K-Drama OST sing-along', date: '2025-10-18', time: '6:00 PM', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=center' },
        { title: 'Advice corner: "Ask the Second Lead"', date: '2025-10-25', time: '1:00 PM', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center' },
        { title: 'Community drama script readings', date: '2025-11-01', time: '4:00 PM', image: 'https://images.unsplash.com/photo-1489599808420-5b1b2a0b3b3b?w=600&h=400&fit=crop&crop=center' },
        { title: 'DIY charm bracelet crafting', date: '2025-11-08', time: '2:00 PM', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center' },
        { title: 'Dessert tasting inspired by drama cafés', date: '2025-11-15', time: '3:00 PM', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop&crop=center' }
    ],
    5: [
        { title: 'Mythical creature cosplay parade', date: '2025-10-13', time: '5:00 PM', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center' },
        { title: 'Anime & K-Drama tarot readings', date: '2025-10-22', time: '7:00 PM', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center' },
        { title: 'Lantern release ceremony', date: '2025-10-29', time: '8:30 PM', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center' },
        { title: 'Ghost story circle under the moon', date: '2025-11-05', time: '9:00 PM', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center' },
        { title: 'Fantasy drama trivia quest', date: '2025-11-12', time: '6:30 PM', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&crop=center' },
        { title: '"Summon the Goblin" live roleplay', date: '2025-11-19', time: '8:00 PM', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center' }
    ]
}

const seedTables = async () => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const insertLocationSql = `
            INSERT INTO locations (name, address, city, state, zip, image)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const locationIdMap = []
        for (const loc of locationsData) {
            const result = await client.query(insertLocationSql, [loc.name, loc.address, loc.city, loc.state, loc.zip, loc.image])
            locationIdMap.push(result.rows[0].id)
        }

        const insertEventSql = `
            INSERT INTO events (location_id, title, date, time, image)
            VALUES ($1, $2, $3, $4, $5)
        `

        for (let i = 0; i < locationIdMap.length; i++) {
            const locationId = locationIdMap[i]
            const events = eventsByLocation[i + 1] || []
            for (const ev of events) {
                await client.query(insertEventSql, [locationId, ev.title, ev.date, ev.time, ev.image])
            }
        }

        await client.query('COMMIT')
        console.log('🌱 Seeded locations and events successfully')
    } catch (err) {
        await client.query('ROLLBACK')
        console.error('⚠️ Error seeding tables', err)
        throw err
    } finally {
        client.release()
    }
}

const run = async () => {
    try {
        console.log('Step 1/2: createTables()')
        await createTables()
        console.log('Step 2/2: seedTables()')
        await seedTables()
        console.log('✅ Reset completed')
    } catch (err) {
        console.error('Reset failed:', err)
        process.exitCode = 1
    } finally {
        console.log('Closing DB pool...')
        await pool.end()
        console.log('DB pool closed.')
    }
}

// Always run when invoked (script is not imported anywhere else)
console.log('▶️  Running reset...')
run()

export default run

