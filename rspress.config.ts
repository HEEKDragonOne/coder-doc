// import * as path from 'node:path';
import {defineConfig} from 'rspress/config';

export default defineConfig({
  root: 'docs',
  // root: path.join(__dirname, 'docs'),
  title: '墨水记忆',
  description:"中文系列指南",
  icon: './docs/public/rspress-icon.png',
  logoText:"墨水记忆",
  logo: {
    light: '/rspress-icon.png',
    dark: '/rspress-icon.png',
  },
  route: {
    cleanUrls: false,
  },
  themeConfig: {
    // socialLinks: [
    //   {
    //     icon: 'github',
    //     mode: 'link',
    //     content: 'https://github.com/HEEKDragonOne/coder-doc',
    //   }
    // ],
    // 导航栏显示设置
    hideNavbar: 'auto',
    outlineTitle: '目录',
    prevPageText: '上一页',
    nextPageText: '下一页',
    enableContentAnimation: true,
    enableScrollToTop: true,
    enableAppearanceAnimation: true,
    outline: true,
    lastUpdated: true,
    lastUpdatedText: "最后更新时间",
    // editLink: {
    //   text:"📝在 GitHub 上编辑此页",
    //   docRepoBaseUrl: "https://github.com/HEEKDragonOne/coder-doc",
    // },
  },
  search: {
    codeBlocks: true,
  },
  markdown: {
    showLineNumbers: true,
  }
  // base: '/docs-polars-cn/'
});
