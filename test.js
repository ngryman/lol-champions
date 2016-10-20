import fetch from './fetch'
import got from 'got'
import test from 'blue-tape'

const req = fetch()

test('Fetches champions list from League of Legends API', async t => {
  const champions = await req
  t.assert(Array.isArray(champions), 'champions is an array')
})

test('Adds "id"', async t => {
  const champions = await req
  let champion = champions[0]
  t.assert(/[a-z ]/.test(champion.id), 'id property is a lower cased string')
})

test('Transmutes "image" object into an valid URL', async t => {
  const champions = await req
  let champion = champions[0]
  t.assert(!champion.image, 'image property is gone')
  t.equal(typeof champion.sprite, 'object', 'sprite property is an object')
  t.equal(typeof champion.sprite.x,
    'number', 'sprite.x property contains x-coordinate'
  )
  t.equal(typeof champion.sprite.y,
    'number', 'sprite.y property contains y-coordinate'
  )

  await got(champion.icon)
})

test('Renames "blurb" to "description"', async t => {
  const champions = await req
  let champion = champions[0]
  t.assert(champion.description, 'description is present')
  t.assert(!champion.blurb, 'blurb property is gone')
})

test('Keeps a set of properties', async t => {
  const champions = await req
  let champion = champions[0]
  t.assert(!champion.version, 'version property is gone')
  t.assert(!champion.info, 'info property is gone')
  t.assert(!champion.blurb, 'blurb property is gone')
  t.assert(!champion.partype, 'partype property is gone')
})
