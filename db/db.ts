import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { leads } from "./schema"

config({ path: ".env.local" })

const schema = {
  leads
}

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client, { schema }) 