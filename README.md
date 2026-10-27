# @coffic/providers

统一 Provider 契约包，供 [cofficlab](https://github.com/CofficLab) 与 [kuaiyizhi-web](https://github.com/Coffic/kuaiyizhi-web) 共享。

## 包含的 Provider

| Provider | Token | 用途 |
|----------|-------|------|
| Footer | `site.footer` | Footer 列聚合、Widget 注入 |
| Header | `site.header` | 导航条目聚合、动作按钮注入 |
| Home | `site.home` | 首页模块聚合 |
| I18n | `site.i18n` | 多语言目录注册、翻译插值 |
| Layout | `site.layout` | 具名布局 + 区域视图注入 |
| Routes | `site.routes` | 路由声明聚合 |
| Crawl | `site.crawl` | 爬虫索引策略（noindex 规则） |

## 依赖

- `@coffic/cosy-kernel` — 插件生命周期与 Provider Token 注册

## 安装

```bash
pnpm add @coffic/providers@github:CosyZone/CosyProviders#v0.1.0
```

## 使用示例

```typescript
import { FooterProvidingToken, type FooterExtension } from "@coffic/providers";

// 在插件中贡献 Footer 扩展
const footerExtension: FooterExtension = {
  id: "my-footer",
  getColumns: (ctx) => [
    {
      id: "links",
      title: "链接",
      items: [
        { id: "about", title: "关于", href: "/about" }
      ]
    }
  ]
};

// 在 activate 中注册
kernel.resolve(FooterProvidingToken).addExtension(pluginID, footerExtension);
```

## 设计原则

1. **接口取超集**：统一接口包含两端所有功能，各项目可按需使用子集
2. **Token 命名统一**：全部使用 `site.*` 命名空间
3. **零业务依赖**：只依赖 `@coffic/cosy-kernel`，不感知具体业务领域
4. **类型安全**：完整的 TypeScript 类型定义

## License

MIT
