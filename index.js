import got from 'got'
import sanitize from 'lol-champions/sanitize'

import { CHAMPIONS_URL } from 'lol-champions/constants'

export default function() {
  return got(CHAMPIONS_URL).then((res) => {
    let championsMap = JSON.parse(res.body).data
    let baton = { championsMap }

    let champions = Object.keys(championsMap)
    .map((id) => {
      championsMap[id].id = id.toLowerCase()
      return championsMap[id]
    })

    for (let champion of champions) {
      sanitize(champion, baton)
    }

    return champions
  })
}
