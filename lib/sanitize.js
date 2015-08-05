import values from 'object-values'

import { IMAGES_URL } from 'lol-champions/constants'

let Sanitizers = {
  icon(champion) {
    champion.icon = `${IMAGES_URL}/${champion.image.full}`
    delete champion.image
  },

  description(champion) {
    champion.description = champion.blurb
    delete champion.blurb
  },

  omit(champion) {
    delete champion.version
    delete champion.info
    delete champion.key
    delete champion.partype
  }
}

export default function(champion, baton) {
  for (let sanitize of values(Sanitizers)) {
    sanitize(champion, baton)
  }
}
