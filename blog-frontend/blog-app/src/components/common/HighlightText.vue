<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  keyword: {
    type: String,
    default: ''
  },
  highlightClass: {
    type: String,
    default: 'highlight'
  }
});

// 高亮处理
const highlightedText = computed(() => {
  if (!props.keyword || !props.text) {
    return props.text;
  }
  
  const regex = new RegExp(`(${props.keyword})`, 'gi');
  return props.text.replace(regex, `<span class="${props.highlightClass}">$1</span>`);
});
</script>

<template>
  <span v-html="highlightedText"></span>
</template>

<style scoped>
:deep(.highlight) {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  color: #2d3436;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(253, 203, 110, 0.3);
  animation: highlightPulse 2s ease-in-out;
}

@keyframes highlightPulse {
  0% {
    background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
    transform: scale(1);
  }
  50% {
    background: linear-gradient(135deg, #fdcb6e, #e17055);
    transform: scale(1.05);
  }
  100% {
    background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
    transform: scale(1);
  }
}
</style>