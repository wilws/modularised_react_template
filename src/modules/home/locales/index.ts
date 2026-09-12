import { defineLocale } from "../../../app/locales";

/**
 * Strings owned by the home module. Nothing outside this module reads them.
 */
export const homeLocale = defineLocale({
  EN: {
    "home.hero.title": "Modular React Template",
    "home.hero.subtitle":
      "A page is a module. The router is the only wire between a module and the app.",
    "home.hero.cta": "Read the structure",
    "home.rules.title": "Module rules",
    "home.rules.one": "A module owns its views, components, locales and styles.",
    "home.rules.two": "A module exposes routes only — never imports from app internals.",
    "home.rules.three": "Modules never import each other; they navigate by path.",
    "home.counter.label": "Counter",
    "home.counter.increment": "Add one",
    "home.counter.reset": "Reset",
    "home.counter.value": "Current value: {count}",
  },
  JP: {
    "home.hero.title": "モジュール型 React テンプレート",
    "home.hero.subtitle":
      "ページはモジュールです。ルーターがモジュールとアプリをつなぐ唯一の接点です。",
    "home.hero.cta": "構成を見る",
    "home.rules.title": "モジュールの原則",
    "home.rules.one":
      "モジュールはビュー、コンポーネント、翻訳、スタイルを自身で持ちます。",
    "home.rules.two":
      "モジュールが公開するのはルートのみで、アプリ内部を参照しません。",
    "home.rules.three":
      "モジュール同士は参照せず、パスで遷移します。",
    "home.counter.label": "カウンター",
    "home.counter.increment": "1 を加算",
    "home.counter.reset": "リセット",
    "home.counter.value": "現在の値：{count}",
  },
  ZH: {
    "home.hero.title": "模組化 React 範本",
    "home.hero.subtitle":
      "每個頁面都是一個模組。路由是模組與應用之間唯一的連接點。",
    "home.hero.cta": "查看架構",
    "home.rules.title": "模組守則",
    "home.rules.one": "模組自行擁有其畫面、元件、翻譯與樣式。",
    "home.rules.two": "模組僅對外公開路由，不引用應用內部實作。",
    "home.rules.three": "模組之間互不引用，改以路徑導航。",
    "home.counter.label": "計數器",
    "home.counter.increment": "加一",
    "home.counter.reset": "重設",
    "home.counter.value": "目前數值：{count}",
  },
  CN: {
    "home.hero.title": "模块化 React 模板",
    "home.hero.subtitle":
      "每个页面都是一个模块。路由是模块与应用之间唯一的连接点。",
    "home.hero.cta": "查看架构",
    "home.rules.title": "模块守则",
    "home.rules.one": "模块自行拥有其视图、组件、翻译与样式。",
    "home.rules.two": "模块仅对外暴露路由，不引用应用内部实现。",
    "home.rules.three": "模块之间互不引用，改用路径导航。",
    "home.counter.label": "计数器",
    "home.counter.increment": "加一",
    "home.counter.reset": "重置",
    "home.counter.value": "当前数值：{count}",
  },
});
