import request from '@/utils/request';
// 请求用户频道列表数据的 API
export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}
// 根据频道ID 请求频道下的文章列表数据
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id,
      timestamp: time
    }
  })
}
// 根据 id 指定文章为不感兴趣
export const dislikeArticleAPI = id => {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}
// 根据 id 指定举报文章
export const reportArticleAPI = (target, type) => {
  return request.post('/v1_0/article/reports', {
    target,
    type
  })
}
// 获取所有频道数据的 API
export const getAllChannelAPI = () => {
  return request.get('/v1_0/channels')
}
// 更新用户频道列表数据的 API
// 注意：形参 channels 是一个数组，格式： [ {id, seq} ]
export const updateUserChannelAPI = channels => {
  return request.put('/v1_0/user/channels', {
    channels
  })
}