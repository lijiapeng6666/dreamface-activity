# 项目架构说明

## 重构概述

本项目将原本集中在 `main.ts` 中的功能进行了模块化重构，提高了代码的可维护性和可扩展性。

## 目录结构

```
src/main/
├── main.ts                    # 主入口文件，只保留核心启动逻辑
├── menu.ts                    # 菜单构建器 (保持不变)
├── preload.ts                 # 预加载脚本 (保持不变)
├── util.ts                    # 工具函数 (保持不变)
├── core/                      # 核心功能模块
│   ├── app-updater.ts         # 应用更新器
│   ├── window-manager.ts      # 窗口管理器
│   └── ipc-manager.ts         # IPC 通信管理器
├── services/                  # 业务服务模块
│   └── compress-upload/       # 压缩上传服务 (独立模块)
│       ├── index.ts           # 服务主文件
│       ├── types.ts           # 类型定义
│       ├── compressor.ts      # 图片压缩逻辑
│       ├── uploader.ts        # 上传逻辑
│       └── config.ts          # 配置文件
├── handlers/                  # IPC 处理器
│   ├── index.ts               # 处理器注册中心
│   └── compress-upload.ts     # 压缩上传处理器
└── types/                     # 公共类型定义
    └── index.ts
```

## 架构设计原则

### 1. 单一职责原则
每个模块只负责一个特定的功能领域：
- **core/**: 应用核心功能（窗口、更新、IPC）
- **services/**: 业务逻辑服务
- **handlers/**: IPC 通信处理

### 2. 依赖注入
各模块之间通过明确的接口进行通信，减少耦合度。

### 3. 配置分离
将配置信息独立到配置文件中，便于管理和修改。

## 模块说明

### Core 模块

#### AppUpdater (`core/app-updater.ts`)
- 负责应用自动更新功能
- 从原 `main.ts` 中的 `AppUpdater` 类提取

#### WindowManager (`core/window-manager.ts`)
- 负责主窗口的创建和管理
- 包含开发工具安装、窗口配置等功能

#### IpcManager (`core/ipc-manager.ts`)
- 统一管理所有 IPC 通信
- 负责注册和清理 IPC 处理器

### Services 模块

#### CompressUploadService (`services/compress-upload/`)
原本在 `main.ts` 中的 `compress-and-upload` IPC 处理器已被重构为独立的服务模块：

- **index.ts**: 服务主入口，提供统一的 API
- **types.ts**: TypeScript 类型定义
- **compressor.ts**: 图片压缩逻辑，使用 Sharp 库
- **uploader.ts**: 文件上传逻辑，处理 FormData 和 API 调用
- **config.ts**: 配置文件，包含 API 地址、用户 ID 等

**主要功能：**
```typescript
// 完整的压缩上传流程
compressUploadService.processImage(payload, quality)

// 只压缩图片
compressUploadService.compressOnly(payload, quality)

// 只上传文件
compressUploadService.uploadOnly(buffer)
```

### Handlers 模块

#### IPC 处理器注册
- **index.ts**: 统一注册所有 IPC 处理器
- **compress-upload.ts**: 压缩上传相关的 IPC 处理器

## 未来扩展方案

### 添加新服务的步骤

1. **创建服务目录**
   ```
   src/main/services/new-service/
   ├── index.ts
   ├── types.ts
   ├── config.ts
   └── [其他模块文件]
   ```

2. **创建 IPC 处理器**
   ```
   src/main/handlers/new-service.ts
   ```

3. **注册处理器**
   在 `handlers/index.ts` 中添加新的处理器注册

### 推荐的命名规范

- **服务目录**: kebab-case (如 `compress-upload`, `user-auth`)
- **文件名**: kebab-case (如 `user-manager.ts`, `data-processor.ts`)
- **类名**: PascalCase (如 `UserManager`, `DataProcessor`)
- **函数名**: camelCase (如 `processData`, `uploadFile`)

## 迁移指南

### 从旧架构迁移现有功能

1. **识别功能模块**: 将现有功能按业务逻辑分组
2. **创建服务**: 为每个功能组创建独立的服务目录
3. **提取配置**: 将硬编码的配置项移到配置文件
4. **创建处理器**: 为每个服务创建对应的 IPC 处理器
5. **更新注册**: 在处理器注册中心添加新的处理器

### 渐进式重构策略

1. **保持向后兼容**: 重构时保持现有 IPC 接口不变
2. **逐步迁移**: 一次迁移一个功能模块
3. **充分测试**: 每次迁移后进行完整测试
4. **文档更新**: 及时更新相关文档

## 优势

### 1. **模块化设计**
- 每个功能模块独立，便于测试和维护
- 降低模块间的耦合度

### 2. **易于扩展**
- 新功能可以独立开发，不影响现有代码
- 标准化的目录结构和命名规范

### 3. **代码复用**
- 服务可以被多个 IPC 处理器复用
- 通用功能可以提取到工具类中

### 4. **团队协作友好**
- 明确的模块边界，减少代码冲突
- 每个开发者可以专注于特定的模块

### 5. **配置管理**
- 集中管理配置，便于环境切换
- 敏感信息可以独立管理

## 最佳实践

1. **错误处理**: 每个服务都应该有完善的错误处理机制
2. **日志记录**: 添加适当的日志记录，便于调试
3. **类型安全**: 充分利用 TypeScript 的类型系统
4. **单元测试**: 为每个服务编写单元测试
5. **文档维护**: 保持代码注释和文档的及时更新
