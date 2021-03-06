import friend from './modules/friend'
import group from './modules/group'
import news from './modules/news'
import sys from './modules/sys'
import validate from './modules/validate'
import user from './modules/user'

export const API = 'api'

export default {
  ...user,
  ...friend,
  ...group,
  ...news,
  ...sys,
  ...validate,
}
