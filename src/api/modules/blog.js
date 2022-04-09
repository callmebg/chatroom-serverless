import request from '@/utils/request'


export default {
  /**发布博客 */
  publishBlog(data) {
    return request.post(`blog/publish`, data)
  },
  /**获取博客列表 */
  getBlogList(data) {
    return request.post(`blog/getBlogList`, data)
  },
  /**查看博客详情 */
  getBlogInfo(id) {
    return request.get(`blog/getBlogInfo?id=${id}`)
  },
  /**获取博客的所有分类 */
  getBlogCategory() {
    return request.get(`blog/getBlogCategory`)
  },
  getBlogTag(cateId) {
    return request.get(`blog/getBlogTag?cateId=${cateId}`)
  }
}
