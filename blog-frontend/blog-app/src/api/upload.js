import request from '../utils/request';

/**
 * 上传文件
 * @param {FormData} formData - 包含文件的FormData对象
 * @returns {Promise}
 */
export function uploadFile(formData) {
  return request({
    url: '/files',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 上传图片
 * @param {FormData} formData - 包含图片的FormData对象
 * @returns {Promise}
 */
export function uploadImage(formData) {
  return request({
    url: '/files/images',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}