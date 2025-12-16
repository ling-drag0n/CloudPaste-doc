// VitePress 主题配置

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import mediumZoom from 'medium-zoom'

// 样式导入
import './custom.css'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    const router = useRouter()

    // 图片放大功能
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }

    onMounted(async () => {
      initZoom()

      // NProgress 页面加载进度条
      if (typeof window !== 'undefined') {
        const nprogress = await import('nprogress')
        nprogress.configure({ showSpinner: false })

        router.onBeforeRouteChange = () => {
          nprogress.start()
        }

        router.onAfterRouteChanged = () => {
          nprogress.done()
        }
      }
    })

    watch(() => route.path, () => nextTick(() => initZoom()))
  },
  enhanceApp({ app }) {
    // 可在此注册全局组件
  }
} satisfies Theme
