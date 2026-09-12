import { defineLocale } from "./types";

/**
 * App-level strings: chrome that lives outside any single module
 * (header, footer, navigation, shared errors).
 */
export const appLocale = defineLocale({
  EN: {
    "app.title": "Modularised React",
    "nav.home": "Home",
    "nav.about": "About",
    "footer.rights": "All rights reserved.",
    "footer.builtWith": "Built with React, Vite and TypeScript.",
    "lang.label": "Language",
    "error.notFound.title": "Page not found",
    "error.notFound.body": "The page you are looking for does not exist.",
    "error.generic.title": "Something went wrong",
    "error.generic.body": "An unexpected error occurred. Please try again.",
    "action.backHome": "Back to home",
  },
  JP: {
    "app.title": "モジュール型 React",
    "nav.home": "ホーム",
    "nav.about": "概要",
    "footer.rights": "全著作権所有。",
    "footer.builtWith": "React、Vite、TypeScript で構築。",
    "lang.label": "言語",
    "error.notFound.title": "ページが見つかりません",
    "error.notFound.body": "お探しのページは存在しません。",
    "error.generic.title": "問題が発生しました",
    "error.generic.body": "予期しないエラーが発生しました。もう一度お試しください。",
    "action.backHome": "ホームへ戻る",
  },
  ZH: {
    "app.title": "模組化 React",
    "nav.home": "首頁",
    "nav.about": "關於",
    "footer.rights": "版權所有。",
    "footer.builtWith": "使用 React、Vite 與 TypeScript 建置。",
    "lang.label": "語言",
    "error.notFound.title": "找不到頁面",
    "error.notFound.body": "您所尋找的頁面不存在。",
    "error.generic.title": "發生錯誤",
    "error.generic.body": "發生未預期的錯誤，請再試一次。",
    "action.backHome": "返回首頁",
  },
  CN: {
    "app.title": "模块化 React",
    "nav.home": "首页",
    "nav.about": "关于",
    "footer.rights": "版权所有。",
    "footer.builtWith": "使用 React、Vite 和 TypeScript 构建。",
    "lang.label": "语言",
    "error.notFound.title": "未找到页面",
    "error.notFound.body": "您查找的页面不存在。",
    "error.generic.title": "出错了",
    "error.generic.body": "发生了意外错误，请重试。",
    "action.backHome": "返回首页",
  },
});
