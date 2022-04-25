import request from '@/utils/request'


export default {
  getMyValidateNews() {
    return request.get(`decision/myValidateNews`)
  }
}
