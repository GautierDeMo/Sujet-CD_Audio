jest.mock('../../configs/db', () => ({
  query: jest.fn(),
}))
const pool = require('../../configs/db')
const { getAllCDs, addCD, deleteCD } = require('../../Controllers/cdController')

const cds = [
  { title: 'Le Monde Chico', artist: 'PNL', year: '2015' },
  { title: 'Dans la légende', artist: 'PNL', year: '2016' },
  { title: 'Deux frères', artist: 'PNL', year: '2019' },
  { title: 'Feu', artist: 'Nekfeu', year: '2015' },
  { title: 'Cyborg', artist: 'Nekfeu', year: '2016' },
  { title: 'Les Étoiles vagabondes', artist: 'Nekfeu', year: '2019' },
  { title: 'Le chant des sirènes', artist: 'Orelsan', year: '2011' },
  { title: 'La fête est finie', artist: 'Orelsan', year: '2017' },
  { title: 'Civilisation', artist: 'Orelsan', year: '2021' },
  { title: 'Temps mort', artist: 'Booba', year: '2002' },
  { title: 'Ouest Side', artist: 'Booba', year: '2006' },
  { title: 'Ultra', artist: 'Booba', year: '2021' },
  { title: "L'École du micro d'argent", artist: 'IAM', year: '1997' },
  { title: 'Suprême NTM', artist: 'Suprême NTM', year: '1998' },
  { title: 'Batterie faible', artist: 'Damso', year: '2016' },
  { title: 'Lithopédion', artist: 'Damso', year: '2018' },
  { title: 'QALF', artist: 'Damso', year: '2020' },
  { title: 'Destin', artist: 'Ninho', year: '2019' },
  { title: 'Jefe', artist: 'Ninho', year: '2021' },
  { title: 'My World', artist: 'Jul', year: '2015' },
  { title: 'JVLIVS', artist: 'SCH', year: '2018' },
  { title: 'Flip', artist: 'Lomepal', year: '2017' },
  { title: 'Jeannine', artist: 'Lomepal', year: '2018' },
  { title: 'Agartha', artist: 'Vald', year: '2017' },
  { title: 'Xeu', artist: 'Vald', year: '2018' },
  { title: "Une main lave l'autre", artist: 'Alpha Wann', year: '2018' },
  { title: 'LMF', artist: 'Freeze Corleone', year: '2020' },
  { title: 'Trinity', artist: 'Laylow', year: '2020' },
  { title: 'Stamina', artist: 'Dinos', year: '2018' },
  { title: 'Or noir', artist: 'Kaaris', year: '2013' },
  { title: 'Commando', artist: 'Niska', year: '2017' },
  { title: 'Qui sème le vent récolte le tempo', artist: 'MC Solaar', year: '1991' },
  { title: 'Opéra Puccino', artist: 'Oxmo Puccino', year: '1998' },
  { title: 'Hybrid Theory', artist: 'Linkin Park', year: '2000' },
  { title: 'Meteora', artist: 'Linkin Park', year: '2003' },
  { title: 'Minutes to Midnight', artist: 'Linkin Park', year: '2007' },
  { title: 'A Thousand Suns', artist: 'Linkin Park', year: '2010' },
  { title: 'Living Things', artist: 'Linkin Park', year: '2012' },
  { title: 'The Hunting Party', artist: 'Linkin Park', year: '2014' },
  { title: 'One More Light', artist: 'Linkin Park', year: '2017' },
  { title: 'From Zero', artist: 'Linkin Park', year: '2024' },
  { title: 'Half Hour of Power', artist: 'Sum 41', year: '2000' },
  { title: 'All Killer No Filler', artist: 'Sum 41', year: '2001' },
  { title: 'Does This Look Infected?', artist: 'Sum 41', year: '2002' },
  { title: 'Chuck', artist: 'Sum 41', year: '2004' },
  { title: 'Underclass Hero', artist: 'Sum 41', year: '2007' },
  { title: 'Screaming Bloody Murder', artist: 'Sum 41', year: '2011' },
  { title: '13 Voices', artist: 'Sum 41', year: '2016' },
  { title: 'Order in Decline', artist: 'Sum 41', year: '2019' },
  { title: 'Heaven :x: Hell', artist: 'Sum 41', year: '2024' },
]

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  }
}

describe('getAllCDs() method', () => {
  /** @type {import('express').Request} */
  const req = {}

  it('should return the list of CDs', async () => {

    pool.query.mockResolvedValue({ rows: cds })
    const res = createRes()

    await getAllCDs(req, res)

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM cds ORDER BY id ASC")
    expect(res.json).toHaveBeenCalledWith(cds)
  })

  it('should respond with an empty list when the database has no CD', async () => {
    pool.query.mockResolvedValue({ rows: [] })
    const res = createRes()

    await getAllCDs(req, res)

    expect(res.json).toHaveBeenCalledWith([])
  })

  it('should respond with a 500 error when the database fails', async () => {
    pool.query.mockRejectedValue(new Error('DB down'))
    const res = createRes()

    await getAllCDs(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'DB down' })
  })
})

describe('addCD() method', () => {
  const req = { body: cds[0] }

  it('should insert the CD and respond with 201 and the created CD', async () => {

    const createdCD = { id: 1, ...cds[0] }
    pool.query.mockResolvedValue({ rows: [createdCD] })
    const res = createRes()

    await addCD(req, res)

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT'),
      [cds[0].title, cds[0].artist, cds[0].year]
    )
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(createdCD)
  })

  it('should respond with a 500 error when the database fails', async () => {
    pool.query.mockRejectedValue(new Error('DB down'))
    const res = createRes()

    await addCD(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'DB down' })
  })
})

describe('deleteCD() method', () => {
  const req = { params: { id: '1' } }

  it('should delete the CD and respond with 204', async () => {

    pool.query.mockResolvedValue()
    const res = createRes()

    await deleteCD(req, res)

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE'), ['1'])
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.send).toHaveBeenCalled()
  })

  it('should respond with a 500 error when the database fails', async () => {
    pool.query.mockRejectedValue(new Error('DB down'))
    const res = createRes()

    await deleteCD(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'DB down' })
  })
})
