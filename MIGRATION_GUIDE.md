# 迁移指南

## 重构成果总结

### ✅ 已完成的重构

1. **📁 目录结构重组**
   - 将原本 197 行的 `main.ts` 拆分为多个专门模块
   - 创建了清晰的 `core/`、`services/`、`handlers/` 目录结构

2. **🔧 compress-and-upload 服务独立化**
   - 从 `main.ts` 中提取了压缩上传功能(第36-92行)
   - 拆分为5个专门文件：配置、类型、压缩器、上传器、主服务

3. **💼 核心功能模块化**
   - `AppUpdater` → [`core/app-updater.ts`](src/main/core/app-updater.ts)
   - `WindowManager` → [`core/window-manager.ts`](src/main/core/window-manager.ts)
   - `IpcManager` → [`core/ipc-manager.ts`](src/main/core/ipc-manager.ts)

### 📊 代码对比

**重构前 (main.ts):**
```typescript
// 197行代码，包含：
- 应用更新器逻辑
- 窗口创建和管理
- IPC 通信处理
- 压缩上传业务逻辑
- 应用生命周期管理
```

**重构后 (main.ts):**
```typescript
// 55行代码，只专注于：
- 模块初始化
- 应用生命周期管理
```

## 使用新架构的优势

### 1. **独立维护 compress-upload**

**旧方式:** 修改压缩上传功能需要在巨大的 `main.ts` 中找到相关代码

**新方式:** 直接修改 [`services/compress-upload/`](src/main/services/compress-upload/) 目录下的文件
```typescript
// 更新配置
import { DEFAULT_UPLOAD_CONFIG } from './config';

// 修改压缩逻辑
import { ImageCompressor } from './compressor';

// 调整上传逻辑
import { FileUploader } from './uploader';
```

### 2. **添加新服务的标准流程**

例如添加 `user-auth` 服务：

```bash
# 1. 创建服务目录
src/main/services/user-auth/
├── index.ts           # 主服务类
├── types.ts          # 类型定义
├── config.ts         # 配置文件
├── auth-provider.ts  # 认证提供者
└── token-manager.ts  # Token 管理器

# 2. 创建 IPC 处理器
src/main/handlers/user-auth.ts

# 3. 注册处理器
# 在 handlers/index.ts 中添加注册
```

### 3. **清晰的依赖关系**

```
main.ts
├── core/app-updater.ts
├── core/window-manager.ts
└── core/ipc-manager.ts
    └── handlers/index.ts
        ├── compress-upload.ts → services/compress-upload/
        ├── user-auth.ts → services/user-auth/
        └── [其他服务处理器]
```

## 实际操作示例

### 修改压缩上传配置

**旧方式 (需要修改 main.ts):**
```typescript
// 在 main.ts 第54行硬编码修改
formData.append('user_id', '新的用户ID');
```

**新方式 (只需修改配置文件):**
```typescript
// 修改 services/compress-upload/config.ts
export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  userId: '新的用户ID',  // ← 只需要改这里
  apiUrl: 'https://api.example.com',
  // ...
};
```

### 添加压缩质量预设

**新架构下的扩展:**
```typescript
// services/compress-upload/config.ts
export const QUALITY_PRESETS = {
  LOW: 60,
  MEDIUM: 80,
  HIGH: 95,
  LOSSLESS: 100,
};

// services/compress-upload/index.ts
export class CompressUploadService {
  async processImageWithPreset(
    payload: CompressUploadPayload,
    preset: keyof typeof QUALITY_PRESETS
  ) {
    const quality = QUALITY_PRESETS[preset];
    return this.processImage(payload, quality);
  }
}
```

### 错误处理改进

**旧方式:** 所有错误处理混在一起
```typescript
catch (error) {
  console.error('Compression and upload failed:', error);
  // 很难区分是压缩错误还是上传错误
}
```

**新方式:** 分层错误处理
```typescript
// compressor.ts
throw new Error(`压缩失败: ${error.message}`);

// uploader.ts  
throw new Error(`上传失败: ${error.message}`);

// index.ts
catch (error) {
  // 能清楚知道错误来源
  return { success: false, error: error.message };
}
```

## 后续建议

### 1. **逐步迁移其他功能**
按优先级将其他功能逐一拆分：
1. 如果有文件处理功能 → `file-processor` 服务
2. 如果有数据库操作 → `database` 服务  
3. 如果有网络请求 → `api-client` 服务

### 2. **建立测试体系**
```typescript
// 为每个服务创建测试
src/main/__tests__/
├── services/
│   ├── compress-upload.test.ts
│   └── user-auth.test.ts
└── core/
    └── window-manager.test.ts
```

### 3. **配置管理优化**
考虑使用环境变量和配置文件：
```typescript
// config/index.ts
export const config = {
  uploadService: {
    apiUrl: process.env.UPLOAD_API_URL || DEFAULT_UPLOAD_CONFIG.apiUrl,
    userId: process.env.USER_ID || DEFAULT_UPLOAD_CONFIG.userId,
  }
};
```

## 总结

通过这次重构，您的项目现在具备了：

- ✅ **模块化架构**: 每个功能独立维护
- ✅ **清晰职责**: 核心逻辑与业务逻辑分离
- ✅ **易于扩展**: 标准化的添加新功能流程
- ✅ **团队友好**: 多人协作不会产生代码冲突
- ✅ **配置分离**: 便于管理和环境切换

现在每个团队成员都可以专注于特定的模块，而不用担心影响其他功能。这为后续的功能开发和维护奠定了良好的基础。
