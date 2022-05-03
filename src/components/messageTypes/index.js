import { MSG_TYPES } from '@/const'
import messageFile from './file'
import messageText from './text'
import messageImg from './img'

export default {
  messageFile,
  messageText,
  messageImg
}

export const messageTypesCmp = {
  [MSG_TYPES.text+'cmp']: messageText,
  [MSG_TYPES.img+'cmp']: messageImg,
  [MSG_TYPES.file+'cmp']: messageFile
}

export const mixins = {
  props: {
    message: {
      type: Object
    }
  }
}
