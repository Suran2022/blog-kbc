<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '../../store/search';
import { Search } from '@element-plus/icons-vue';
import SearchSuggestions from './SearchSuggestions.vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索文章...'
  },
  showSuggestions: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default'
  }
});

const emit = defineEmits(['search', 'focus', 'blur']);

const router = useRouter();
const searchStore = useSearchStore();

const keyword = ref('');
const showSuggestionsPanel = ref(false);
const searchInputRef = ref(null);
const suggestionsRef = ref(null);

const inputClass = computed(() => {
  return {
    'search-box': true,
    [`search-box--${props.size}`]: true,
    'search-box--focused': showSuggestionsPanel.value
  };
});

const performSearch = () => {
  const searchKeyword = keyword.value.trim();
  if (!searchKeyword) return;
  
  searchStore.addToHistory(searchKeyword);
  showSuggestionsPanel.value = false;
  emit('search', searchKeyword);
  
  router.push({
    name: 'SearchResults',
    query: { keyword: searchKeyword }
  });
};

const clearSearch = () => {
  keyword.value = '';
  searchInputRef.value?.focus();
};

const handleFocus = () => {
  if (props.showSuggestions) {
    showSuggestionsPanel.value = true;
  }
  emit('focus');
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestionsPanel.value = false;
    emit('blur');
  }, 200);
};

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    performSearch();
  } else if (event.key === 'Escape') {
    showSuggestionsPanel.value = false;
    searchInputRef.value?.blur();
  }
};

const handleClickOutside = (event) => {
  if (!searchInputRef.value?.contains(event.target) && 
      !suggestionsRef.value?.$el?.contains(event.target)) {
    showSuggestionsPanel.value = false;
  }
};

watch(showSuggestionsPanel, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

defineExpose({
  focus: () => searchInputRef.value?.focus(),
  blur: () => searchInputRef.value?.blur(),
  clear: clearSearch,
  setKeyword: (value) => keyword.value = value
});
</script>

<template>
  <div class="search-container">
    <div :class="inputClass">
      <el-input
        ref="searchInputRef"
        v-model="keyword"
        :placeholder="placeholder"
        :size="size"
        clearable
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @clear="clearSearch"
        class="search-input"
      >
        <template #prefix>
          <el-icon class="search-icon"><Search /></el-icon>
        </template>
        <template #suffix>
          <el-button
            type="primary"
            :size="size"
            @click="performSearch"
            class="search-btn"
            :disabled="!keyword.trim()"
          >
            搜索
          </el-button>
        </template>
      </el-input>
    </div>
    
    <div 
      v-if="showSuggestionsPanel && showSuggestions" 
      class="suggestions-panel"
    >
      <SearchSuggestions ref="suggestionsRef" />
    </div>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-box {
  position: relative;
  transition: all 0.3s ease;
}

.search-box--large {
  font-size: 16px;
}

.search-box--default {
  font-size: 14px;
}

.search-box--small {
  font-size: 12px;
}

.search-box--focused {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(94, 114, 228, 0.15);
}

.search-input {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 25px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

:deep(.el-input__wrapper:hover) {
  border-color: #5e72e4;
  box-shadow: 0 4px 15px rgba(94, 114, 228, 0.1);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #5e72e4;
  box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.1);
}

:deep(.el-input__inner) {
  padding-left: 45px;
  padding-right: 80px;
  font-size: inherit;
  color: #495057;
}

:deep(.el-input__inner::placeholder) {
  color: #adb5bd;
}

.search-icon {
  color: #6c757d;
  font-size: 16px;
  margin-left: 12px;
}

.search-btn {
  margin-right: 8px;
  border-radius: 15px;
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: linear-gradient(135deg, #4c63d2, #7048e8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.3);
}

.search-btn:disabled {
  background: #dee2e6;
  color: #6c757d;
  transform: none;
  box-shadow: none;
}

.suggestions-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  :deep(.el-input__inner) {
    padding-left: 40px;
    padding-right: 70px;
  }
  
  .search-icon {
    font-size: 14px;
    margin-left: 10px;
  }
  
  .search-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .search-btn {
    font-size: 11px;
    padding: 4px 8px;
  }
}
</style>