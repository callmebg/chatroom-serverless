import friendly from './modules/friendly'
import group from './modules/group'
import news from './modules/news'
import sys from './modules/sys'
import validate from './modules/validate'
// import user from './modules/user'
import user from './modules/users'
import blog from './modules/blog'

export const API = 'api'

export default {
  ...user,
  ...friendly,
  ...group,
  ...news,
  ...sys,
  ...validate,
  ...blog
}