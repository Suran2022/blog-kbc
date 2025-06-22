<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useArticleStore } from '../../store/article';
import { useCategoryStore } from '../../store/category';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Editor from '@tinymce/tinymce-vue';
import { Plus } from '@element-plus/icons-vue';
// 不再使用本地导入，改为在index.html中通过CDN加载TinyMCE
// 这样可以避免模块导入问题

// 设置TinyMCE全局配置
const initTinyMCE = () => {
  if (window.tinymce) {
    // 确保TinyMCE已加载
    console.log('初始化TinyMCE配置');
    console.log('TinyMCE版本:', window.tinymce.majorVersion, window.tinymce.minorVersion);
    
    // 添加调试日志
    window.tinymce.on('AddEditor', (e) => {
      console.log('编辑器添加:', e.editor);
    });
    
    window.tinymce.on('BeforeRenderUI', (e) => {
      console.log('编辑器渲染前:', e.editor);
    });
    
    // 可以在这里添加其他全局配置
  } else {
    console.error('TinyMCE未加载，window.tinymce不存在');
  }
};

// 在组件挂载后初始化TinyMCE
// 使用onMounted钩子中调用，不需要在这里使用setTimeout

const props = defineProps({
  articleId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['save-success', 'cancel']);

const router = useRouter();
const articleStore = useArticleStore();
const categoryStore = useCategoryStore();

// TinyMCE编辑器加载状态
const isTinyMCELoaded = ref(false);

// 表单数据
const articleForm = ref({
  title: '',
  content: '',
  summary: '',
  categoryId: '',
  tags: [],
  status: 1,
  coverImage: ''
});

// 表单规则
const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }]
};

// 表单引用
const formRef = ref(null);
// 编辑器引用
const editorRef = ref(null);

// 加载状态
const loading = ref(false);
// 保存状态
const saving = ref(false);

// 标签输入
const tagInputVisible = ref(false);
const tagInputValue = ref('');
const tagInputRef = ref(null);

// 文章状态选项
const statusOptions = [
  { label: '已发布', value: 1 },
  { label: '草稿', value: 0 }
];

// 是否为编辑模式
const isEditMode = computed(() => !!props.articleId);

// 页面标题
const pageTitle = computed(() => isEditMode.value ? '编辑文章' : '创建文章');

// 获取文章详情
const fetchArticleDetail = async () => {
  if (!props.articleId) return;
  
  loading.value = true;
  try {
    await articleStore.fetchArticleById(props.articleId);
    const article = articleStore.currentArticle;
    
    if (article) {
      articleForm.value = {
        title: article.title || '',
        content: article.content || '',
        summary: article.summary || '',
        categoryId: article.category ? article.category.id : '',
        tags: article.tags || [],
        status: article.status !== undefined ? article.status : 1,
        coverImage: article.coverImage || ''
      };
    }
  } catch (error) {
    console.error('获取文章详情失败:', error);
    ElMessage.error('获取文章详情失败');
  } finally {
    loading.value = false;
  }
};

// 获取分类列表
const fetchCategories = async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('获取分类列表失败:', error);
    ElMessage.error('获取分类列表失败');
  }
};

// 显示标签输入框
const showTagInput = () => {
  tagInputVisible.value = true;
  // 在下一个DOM更新周期后聚焦输入框
  setTimeout(() => {
    tagInputRef.value?.focus();
  });
};

// 处理标签输入确认
const handleTagInputConfirm = () => {
  const value = tagInputValue.value.trim();
  if (value && !articleForm.value.tags.includes(value)) {
    articleForm.value.tags.push(value);
  }
  tagInputVisible.value = false;
  tagInputValue.value = '';
};

// 移除标签
const handleTagRemove = (tag) => {
  articleForm.value.tags = articleForm.value.tags.filter(t => t !== tag);
};

// 上传封面图片
const handleCoverUpload = (file) => {
  // 这里应该调用实际的上传API
  // 模拟上传成功
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    articleForm.value.coverImage = reader.result;
  };
  return false; // 阻止默认上传行为
};

// 移除封面图片
const handleRemoveCover = () => {
  articleForm.value.coverImage = '';
};

// 自动生成摘要
const generateSummary = () => {
  if (!articleForm.value.content) return;
  
  // 简单地截取内容前100个字符作为摘要
  const plainText = articleForm.value.content.replace(/<[^>]+>/g, '');
  articleForm.value.summary = plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
};

// 编辑器初始化完成
const handleEditorInit = (evt, editor) => {
  // 编辑器实例
  editorRef.value = editor;
  console.log('编辑器初始化完成');
  isTinyMCELoaded.value = true;
  
  // 设置编辑器内容
  if (articleForm.value.content) {
    editor.setContent(articleForm.value.content);
  }
  
  // 添加编辑器事件监听
  editor.on('Change', () => {
    articleForm.value.content = editor.getContent();
    handleEditorChange();
  });
};

// 编辑器内容变化
const handleEditorChange = () => {
  // 如果设置了自动生成摘要，可以在这里处理
  if (autoGenerateSummary.value && !articleForm.value.summary) {
    generateSummary();
  }
};

// 是否自动生成摘要
const autoGenerateSummary = ref(false);

// 保存文章
const saveArticle = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    saving.value = true;
    try {
      // 如果没有摘要，自动生成
      if (!articleForm.value.summary) {
        generateSummary();
      }
      
      const articleData = { ...articleForm.value };
      
      if (isEditMode.value) {
        await articleStore.editArticle(props.articleId, articleData);
        ElMessage.success('文章更新成功');
      } else {
        await articleStore.addArticle(articleData);
        ElMessage.success('文章创建成功');
      }
      
      emit('save-success');
    } catch (error) {
      console.error('保存文章失败:', error);
      ElMessage.error('保存文章失败，请稍后重试');
    } finally {
      saving.value = false;
    }
  });
};

// 取消编辑
const cancelEdit = () => {
  emit('cancel');
};

// 监听标签输入框可见性变化
watch(tagInputVisible, (val) => {
  if (val) {
    setTimeout(() => {
      tagInputRef.value?.focus();
    });
  }
});

onMounted(async () => {
  // 初始化TinyMCE全局配置
  initTinyMCE();
  
  // 由于我们已经安装了tinymce核心库，直接设置为已加载
  isTinyMCELoaded.value = true;
  console.log('TinyMCE编辑器已准备就绪');
  
  // 加载分类和文章详情
  await Promise.all([fetchCategories(), fetchArticleDetail()]);
});
</script>

<template>
  <div class="article-editor">
    <div class="editor-header">
      <h2>{{ pageTitle }}</h2>
    </div>
    
    <el-skeleton :rows="10" animated v-if="loading" />
    
    <el-form
      v-else
      ref="formRef"
      :model="articleForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
      </el-form-item>
      
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="articleForm.categoryId" placeholder="请选择文章分类" style="width: 100%">
          <el-option
            v-for="category in categoryStore.categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="文章标签">
        <el-tag
          v-for="tag in articleForm.tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleTagRemove(tag)"
          class="tag-item"
        >
          {{ tag }}
        </el-tag>
        
        <el-input
          v-if="tagInputVisible"
          ref="tagInputRef"
          v-model="tagInputValue"
          class="tag-input"
          size="small"
          @keyup.enter="handleTagInputConfirm"
          @blur="handleTagInputConfirm"
        />
        
        <el-button v-else class="button-new-tag" size="small" @click="showTagInput">
          + 添加标签
        </el-button>
      </el-form-item>
      
      <el-form-item label="封面图片">
        <el-upload
          class="cover-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="handleCoverUpload"
        >
          <img v-if="articleForm.coverImage" :src="articleForm.coverImage" class="cover-image" />
          <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
        </el-upload>
        
        <el-button 
          v-if="articleForm.coverImage" 
          type="danger" 
          size="small" 
          @click="handleRemoveCover"
          class="remove-cover-btn"
        >
          移除封面
        </el-button>
      </el-form-item>
      
      <el-form-item label="文章内容" prop="content">
        <div v-if="!isTinyMCELoaded" class="tinymce-error-message">
          <el-alert
            title="编辑器加载中..."
            type="info"
            description="TinyMCE编辑器正在加载，请稍候..."
            show-icon
            :closable="false"
          />
        </div>
        <div v-else>
          <Editor
            v-model="articleForm.content"
            :init="{
              height: 500,
              menubar: 'file edit view insert format tools table',
              plugins: [
                'advlist autolink lists link image charmap preview',
                'searchreplace code fullscreen',
                'insertdatetime media table help wordcount'
              ],
              language: 'zh_CN', // 使用中文语言包
              toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright | bullist numlist | ' +
                'image link | code | removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              // 图片上传处理
              images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                // 模拟上传成功
                const reader = new FileReader();
                reader.readAsDataURL(blobInfo.blob());
                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.onerror = () => {
                  reject('图片上传失败');
                };
              }),
              // 支持粘贴图片
              paste_data_images: true,
              // 禁用自动检测URL
              convert_urls: false,
              // 设置皮肤和内容样式
              skin: 'oxide',
              content_css: 'default',
              // 添加调试选项
              setup: function(editor) {
                console.log('编辑器设置中...');
                editor.on('init', function(e) {
                  console.log('编辑器初始化完成:', e);
                });
                editor.on('SkinLoaded', function(e) {
                  console.log('皮肤加载完成:', e);
                });
                editor.on('LoadContent', function(e) {
                  console.log('内容加载完成:', e);
                });
              },
              // 禁用缓存
              cache_suffix: '?v=' + new Date().getTime(),
              // 设置基本URL，避免插件路径问题
              base_url: 'https://cdn.jsdelivr.net/npm/tinymce@6'
            }"
            placeholder="请输入文章内容"
            @init="handleEditorInit"
            @change="handleEditorChange"
          />
        </div>
      </el-form-item>
      
      <el-form-item label="文章摘要">
        <el-input
          v-model="articleForm.summary"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要（留空将自动生成）"
        />
        <div class="summary-actions">
          <el-button type="primary" link @click="generateSummary">自动生成摘要</el-button>
          <el-checkbox v-model="autoGenerateSummary" label="编辑内容时自动更新摘要" border />
        </div>
      </el-form-item>
      
      <el-form-item label="文章状态">
        <el-radio-group v-model="articleForm.status">
          <el-radio 
            v-for="option in statusOptions" 
            :key="option.value" 
            :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="saveArticle" :loading="saving">
          {{ isEditMode ? '更新文章' : '发布文章' }}
        </el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.article-editor {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.editor-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.editor-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.tag-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

.tag-input {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}

.button-new-tag {
  margin-bottom: 10px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-uploader:hover {
  border-color: #409EFF;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 180px;
  line-height: 180px;
  text-align: center;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-cover-btn {
  margin-top: 10px;
}

.summary-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tinymce-error-message {
  margin-bottom: 15px;
}
</style>