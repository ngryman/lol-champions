import values from 'object-values'

let Sanitizers = {
  icon(champion, context) {
    champion.icon = `${context.imagesUrl}/champion/${champion.image.full}`
    champion.sprite = {
      url: `${context.imagesUrl}/sprite/${champion.image.sprite}`,
      x: champion.image.x,
      y: champion.image.y,
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
  },
}

export default function sanitize(champion, context) {
  for (let sanitize of values(Sanitizers)) {
    sanitize(champion, context)
  }
  return champion
}
