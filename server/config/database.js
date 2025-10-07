import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Ensure env is loaded regardless of caller CWD
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootEnvPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: rootEnvPath })
// Fallback: also try server/.env if root .env not present or missing vars
if (!process.env.PGHOST || !process.env.PGDATABASE) {
    dotenv.config({ path: path.resolve(__dirname, '../.env') })
}

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
    ssl: process.env.PGHOST && !/^(localhost|127\.0\.0\.1|::1)$/i.test(process.env.PGHOST)
        ? { rejectUnauthorized: false }
        : false
}

export const pool = new pg.Pool(config)