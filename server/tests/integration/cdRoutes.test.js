const { PostgreSqlContainer } = require('@testcontainers/postgresql')
const fs = require('node:fs')
const path = require('node:path')
const request = require('supertest')
/** @type {import('pg').Pool} */
let pool
/** @type { import('express').Express } */
let app
/** @type { import('@testcontainers/postgresql').StartedPostgreSqlContainer } */
let container


const meteora = { title: 'Meteora', artist: 'Linkin Park', year: '2003' }
const chuck = { title: 'Chuck', artist: 'Sum 41', year: '2004' }

/**
 * @param {{ title: any; artist: any; year: any; }} cd
 */
async function insertCD(cd) {
  const result = await pool.query(
    'INSERT INTO cds (title, artist, year) VALUES ($1, $2, $3) RETURNING *',
    [cd.title, cd.artist, cd.year]
  )
  return result.rows[0]
}

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:latest')
    .withCopyFilesToContainer([{
      source: path.join(__dirname, '../../configs/import.sql'),
      target: '/docker-entrypoint-initdb.d/init_db.sql'
    }])
    .withName('cd_test')
    .withDatabase('cd_database')
    .start()
  process.env.URI_DB = container.getConnectionUri()

  pool = require('../../configs/db')
  app = require('../../server')
}, 60000)

beforeEach(async () => {
  await pool.query('TRUNCATE TABLE cds RESTART IDENTITY')
})

afterAll(async () => {
  await pool.end()
  await container.stop()
})

describe('GET /api/cds', () => {

  it('should respond with an empty list when the database has no CD', async () => {
    const response = await request(app).get('/api/cds')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual([])
  })

  it('should respond with all the CDs stored in the database, ordered by id', async () => {
    await insertCD(meteora)
    await insertCD(chuck)

    const response = await request(app).get('/api/cds')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toStrictEqual(expect.objectContaining({
      id: expect.any(Number),
      title: meteora.title,
      artist: meteora.artist,
      year: 2003,
    }))
    expect(response.body[1]).toStrictEqual(expect.objectContaining({
      title: chuck.title,
      artist: chuck.artist,
      year: 2004,
    }))
  })
})

describe('POST /api/cds', () => {

  it('should respond with 201 and the created CD', async () => {
    const response = await request(app)
      .post('/api/cds')
      .send(meteora)

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(expect.objectContaining({
      id: expect.any(Number),
      title: meteora.title,
      artist: meteora.artist,
      year: 2003,
    }))
  })

  it('should store the CD in the database', async () => {
    const postResponse = await request(app)
      .post('/api/cds')
      .send(meteora)

    const getResponse = await request(app).get('/api/cds')

    expect(getResponse.body).toHaveLength(1)
    expect(getResponse.body[0]).toStrictEqual(postResponse.body)
  })

  it('should respond with a 500 error when a required field is missing', async () => {
    const response = await request(app)
      .post('/api/cds')
      .send({ title: 'No artist, no year' })

    expect(response.status).toBe(500)
    expect(response.body.error).toMatch(/not-null/i)
  })
})

describe('DELETE /api/cds/:id', () => {

  it('should delete the CD and respond with 204', async () => {
    const createdCD = await insertCD(meteora)

    const response = await request(app).delete(`/api/cds/${createdCD.id}`)

    expect(response.status).toBe(204)
    const getResponse = await request(app).get('/api/cds')
    expect(getResponse.body).toStrictEqual([])
  })

  it('should not delete the other CDs', async () => {
    const cdToDelete = await insertCD(meteora)
    const cdToKeep = await insertCD(chuck)

    await request(app).delete(`/api/cds/${cdToDelete.id}`)

    const getResponse = await request(app).get('/api/cds')
    expect(getResponse.body).toHaveLength(1)
    expect(getResponse.body[0].id).toBe(cdToKeep.id)
  })

  it('should respond with 204 even when the CD does not exist', async () => {
    const response = await request(app).delete('/api/cds/999999')

    expect(response.status).toBe(204)
  })

  it('should respond with a 500 error when the id is not a number', async () => {
    const response = await request(app).delete('/api/cds/not-a-number')

    expect(response.status).toBe(500)
    expect(response.body.error).toMatch(/invalid input syntax/i)
  })
})
