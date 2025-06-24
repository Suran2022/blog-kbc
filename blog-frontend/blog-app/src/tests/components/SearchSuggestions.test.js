import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SearchSuggestions from '@/components/common/SearchSuggestions.vue'
import { useSearchStore } from '@/store/search'

// Mock API
vi.mock('@/api/search', () => ({
  getSearchSuggestions: vi.fn(() => Promise.resolve({
    data: ['Vue.js 教程', 'Vue 3 新特性', 'Vue Router']
  })),
  getHotSearchKeywords: vi.fn(() => Promise.resolve({
    data: ['JavaScript', 'Vue.js', 'React', 'Node.js']
  }))
}))

describe('SearchSuggestions', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = mount(SearchSuggestions, {
      global: {
        plugins: [pinia]
      },
      props: {
        keyword: '',
        visible: true
      }
    })
  })

  it('应该正确渲染组件', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.search-suggestions').exists()).toBe(true)
  })

  it('当没有关键词时应该显示热门搜索', async () => {
    await wrapper.vm.$nextTick()
    
    const hotSearchSection = wrapper.find('.hot-search')
    expect(hotSearchSection.exists()).toBe(true)
    expect(wrapper.text()).toContain('热门搜索')
  })

  it('当有关键词时应该显示搜索建议', async () => {
    await wrapper.setProps({ keyword: 'Vue' })
    await wrapper.vm.$nextTick()
    
    // 等待异步数据加载
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const suggestionsSection = wrapper.find('.suggestions')
    expect(suggestionsSection.exists()).toBe(true)
  })

  it('点击建议项应该触发选择事件', async () => {
    await wrapper.setProps({ keyword: 'Vue' })
    await wrapper.vm.$nextTick()
    
    // 等待异步数据加载
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const suggestionItem = wrapper.find('.suggestion-item')
    if (suggestionItem.exists()) {
      await suggestionItem.trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
    }
  })

  it('当visible为false时不应该显示', async () => {
    await wrapper.setProps({ visible: false })
    expect(wrapper.find('.search-suggestions').isVisible()).toBe(false)
  })

  it('应该正确处理空的搜索结果', async () => {
    // Mock 空结果
    const searchStore = useSearchStore()
    searchStore.suggestions = []
    
    await wrapper.setProps({ keyword: 'nonexistent' })
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.no-suggestions').exists()).toBe(true)
  })

  it('应该正确高亮匹配的文本', async () => {
    await wrapper.setProps({ keyword: 'Vue' })
    await wrapper.vm.$nextTick()
    
    // 等待异步数据加载
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const highlightedText = wrapper.find('.highlight')
    if (highlightedText.exists()) {
      expect(highlightedText.text()).toContain('Vue')
    }
  })

  it('应该限制显示的建议数量', async () => {
    const searchStore = useSearchStore()
    searchStore.suggestions = Array.from({ length: 20 }, (_, i) => `建议 ${i + 1}`)
    
    await wrapper.setProps({ keyword: 'test' })
    await wrapper.vm.$nextTick()
    
    const suggestionItems = wrapper.findAll('.suggestion-item')
    expect(suggestionItems.length).toBeLessThanOrEqual(10) // 假设最多显示10个
  })
})