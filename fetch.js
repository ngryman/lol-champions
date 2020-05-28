import got from 'got'
import sanitize from 'lol-champions/sanitize'

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

export default async function fetch() {
  const version = await fetchLatestVersion()
  const championsMap = await fetchChampionsMap(version)
  return transform(version, championsMap)
}
