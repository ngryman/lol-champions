import got from 'got'
import sanitize from 'lol-champions/sanitize'
import { writeFileSync } from 'fs'

export const DDRAGON_URL = 'http://ddragon.leagueoflegends.com'

async function fetchLatestVersion() {
  const res = await got(`${DDRAGON_URL}/api/versions.json`)
  const versions = JSON.parse(res.body)
  return versions[0]
}

async function fetchChampionsMap(version) {
  const res = await got(`${DDRAGON_URL}/cdn/${version}/data/en_US/champion.json`)
  const champions = JSON.parse(res.body).data
  return champions
}

function needsUpdate(version) {
  const currentVersion = require('./package.json').version
  return version !== currentVersion
}

function transform(version, championsMap) {
  const baton = { championsMap, imagesUrl: `${DDRAGON_URL}/cdn/${version}/img` }

  const champions = Object.keys(championsMap)
    .map((id) => {
      championsMap[id].id = id.toLowerCase()
      return championsMap[id]
    })
    .map((champion) => sanitize(champion, baton))

  return champions
}

function saveChampions(champions) {
  writeFileSync('champions.json', JSON.stringify(champions, 0, 2))
}

function saveVersion(version) {
  let pkgContent = JSON.stringify(require('./package.json'), 0, 2)
  pkgContent = pkgContent.replace(/"version": "([\d.]+)"/, `"version": "${version}"`)
  writeFileSync('package.json', pkgContent)
}

async function build() {
  const version = await fetchLatestVersion()
  if (!needsUpdate(version)) return

  const championsMap = await fetchChampionsMap(version)
  const champions = transform(version, championsMap)

  saveChampions(champions)
  saveVersion(version)

  if (process.env.CI) {
    console.log('::set-output name=needs_publish::true')
    console.log(`::set-output name=version_number::${version}`)
  }
}

build()
