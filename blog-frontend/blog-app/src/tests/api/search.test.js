import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchArticles, getSearchSuggestions, getHotSearchKeywords } from '@/api/search'
import request from '@/utils/request'

// Mock request utility
vi.mock('@/utils/request')

describe('Search API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('searchArticles', () => {
    it('应该正确调用搜索文章API', async () => {
      const mockResponse = {
        data: {
          content: [
            {
              id: 1,
              title: 'Vue.js 入门教程',
              summary: '这是一个Vue.js入门教程',
              tags: ['Vue.js', 'JavaScript']
            }
          ],
          totalElements: 1,
          totalPages: 1
        }
      }

      request.get.mockResolvedValue(mockResponse)

      const params = {
        keyword: 'Vue.js',
        tag: 'JavaScript',
        page: 1,
        size: 10,
        sortBy: 'createTime',
        sortDir: 'desc'
      }

      const result = await searchArticles(params)

      expect(request.get).toHaveBeenCalledWith('/search/articles', { params })
      expect(result).toEqual(mockResponse)
    })

    it('应该处理空的搜索参数', async () => {
      const mockResponse = { data: { content: [], totalElements: 0 } }
      request.get.mockResolvedValue(mockResponse)

      const result = await searchArticles({})

      expect(request.get).toHaveBeenCalledWith('/search/articles', { params: {} })
      expect(result).toEqual(mockResponse)
    })

    it('应该处理API错误', async () => {
      const errorMessage = 'Network Error'
      request.get.mockRejectedValue(new Error(errorMessage))

      await expect(searchArticles({ keyword: 'test' })).rejects.toThrow(errorMessage)
    })
  })

  describe('getSearchSuggestions', () => {
    it('应该正确调用搜索建议API', async () => {
      const mockResponse = {
        data: ['Vue.js 教程', 'Vue 3 新特性', 'Vue Router']
      }

      request.get.mockResolvedValue(mockResponse)

      const result = await getSearchSuggestions('Vue', 5)

      expect(request.get).toHaveBeenCalledWith('/search/suggestions', {
        params: { keyword: 'Vue', limit: 5 }
      })
      expect(result).toEqual(mockResponse)
    })

    it('应该使用默认参数', async () => {
      const mockResponse = { data: [] }
      request.get.mockResolvedValue(mockResponse)

      await getSearchSuggestions('test')

      expect(request.get).toHaveBeenCalledWith('/search/suggestions', {
        params: { keyword: 'test', limit: 10 }
      })
    })

    it('应该处理空关键词', async () => {
      const mockResponse = { data: [] }
      request.get.mockResolvedValue(mockResponse)

      const result = await getSearchSuggestions('')

      expect(request.get).toHaveBeenCalledWith('/search/suggestions', {
        params: { keyword: '', limit: 10 }
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getHotSearchKeywords', () => {
    it('应该正确调用热门搜索关键词API', async () => {
      const mockResponse = {
        data: ['JavaScript', 'Vue.js', 'React', 'Node.js', 'TypeScript']
      }

      request.get.mockResolvedValue(mockResponse)

      const result = await getHotSearchKeywords(5)

      expect(request.get).toHaveBeenCalledWith('/search/hot-keywords', {
        params: { limit: 5 }
      })
      expect(result).toEqual(mockResponse)
    })

    it('应该使用默认限制数量', async () => {
      const mockResponse = { data: [] }
      request.get.mockResolvedValue(mockResponse)

      await getHotSearchKeywords()

      expect(request.get).toHaveBeenCalledWith('/search/hot-keywords', {
        params: { limit: 10 }
      })
    })

    it('应该处理API返回错误', async () => {
      const error = new Error('Server Error')
      request.get.mockRejectedValue(error)

      await expect(getHotSearchKeywords()).rejects.toThrow('Server Error')
    })
  })

  describe('错误处理', () => {
    it('应该正确处理网络超时', async () => {
      const timeoutError = new Error('timeout')
      timeoutError.code = 'ECONNABORTED'
      request.get.mockRejectedValue(timeoutError)

      await expect(searchArticles({ keyword: 'test' })).rejects.toThrow('timeout')
    })

    it('应该正确处理服务器错误', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      }
      request.get.mockRejectedValue(serverError)

      await expect(getSearchSuggestions('test')).rejects.toEqual(serverError)
    })

    it('应该正确处理客户端错误', async () => {
      const clientError = {
        response: {
          status: 400,
          data: { message: 'Bad Request' }
        }
      }
      request.get.mockRejectedValue(clientError)

      await expect(getHotSearchKeywords()).rejects.toEqual(clientError)
    })
  })
})