import values from 'object-values'

import { IMAGES_URL } from 'lol-champions/constants'

let Sanitizers = {
  icon(champion) {
    champion.icon = `${IMAGES_URL}/champion/${champion.image.full}`
    champion.sprite = {
      url: `${IMAGES_URL}/sprite/${champion.image.sprite}`,
      x: champion.image.x,
      y: champion.image.y
    }
    delete champion.image
  },

  description(champion) {
    champion.description = champion.blurb
    delete champion.blurb
  },

  omit(champion) {
    delete champion.version
    delete champion.info
    delete champion.partype
  }
}

export default function(champion, baton) {
  for (let sanitize of values(Sanitizers)) {
    sanitize(champion, baton)
  }
}
