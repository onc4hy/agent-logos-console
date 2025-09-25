# 配置 Qoder IDE 使用 pnpm

本文档说明如何配置 Qoder IDE 以在生成代码时使用 pnpm 而不是 npm 作为包管理器。

## 为什么使用 pnpm

pnpm 是一个快速、节省磁盘空间的包管理器，相比 npm 具有以下优势：

1. **速度快**：pnpm 使用硬链接和符号链接来避免重复下载相同的包
2. **节省磁盘空间**：所有包都存储在单一位置，项目中只创建链接
3. **安全性**：pnpm 通过严格的依赖管理防止非法访问
4. **支持 monorepo**：非常适合管理多包项目

## 配置步骤

### 1. 确保系统已安装 pnpm

首先，确保您的系统已安装 pnpm：

```bash
# 检查是否已安装 pnpm
pnpm --version

# 如果未安装，可以通过 npm 安装
npm install -g pnpm

# 或通过其他方式安装（推荐）
# 详见 https://pnpm.io/installation
```

### 2. 配置 Qoder IDE 使用 pnpm

目前 Qoder IDE 会根据项目中的锁文件来决定使用哪个包管理器：

1. 如果项目中存在 `pnpm-lock.yaml` 文件，Qoder IDE 应该自动使用 pnpm
2. 如果项目中存在 `package-lock.json` 文件，Qoder IDE 会默认使用 npm

### 3. 确保项目正确配置为使用 pnpm

为了确保 Qoder IDE 在项目中使用 pnpm，请执行以下步骤：

#### 清理 npm 相关文件

```bash
# 删除 npm 锁文件
rm package-lock.json

# 删除 node_modules（如果存在）
rm -rf node_modules
```

#### 确保存在 pnpm 锁文件

```bash
# 如果不存在 pnpm-lock.yaml，通过安装依赖创建它
pnpm install
```

#### 添加配置文件

在项目根目录添加 `.npmrc` 文件：

```ini
# 确保项目使用 pnpm
engine-strict=true
```

### 4. 验证配置

验证项目已正确配置为使用 pnpm：

```bash
# 检查是否存在 pnpm 锁文件
ls -la pnpm-lock.yaml

# 检查是否不存在 npm 锁文件
ls -la package-lock.json  # 应该显示文件不存在
```

## 项目中的最佳实践

### 1. 使用 pnpm 命令

在项目中始终使用 pnpm 命令而不是 npm：

```bash
# 安装新依赖
pnpm add <package-name>

# 安装开发依赖
pnpm add -D <package-name>

# 删除依赖
pnpm remove <package-name>

# 更新依赖
pnpm update

# 运行脚本
pnpm run <script-name>
```

### 2. 文档说明

在项目的 README.md 文件中明确说明使用 pnpm：

```markdown
## 安装步骤

1. 安装依赖：
   ```bash
   pnpm install
   ```

> 注意：请确保使用 pnpm 作为包管理器。如果之前使用过 npm 安装依赖，请删除 `node_modules` 目录和 `package-lock.json` 文件后重新使用 pnpm 安装。
```

### 3. 团队协作

确保团队成员都使用 pnpm：

1. 在项目文档中明确说明使用 pnpm
2. 在 PR 模板中添加检查项，确保没有提交 npm 相关文件
3. 使用 `.gitignore` 忽略 npm 相关文件

## 故障排除

### 1. Qoder IDE 仍然使用 npm

如果 Qoder IDE 仍然使用 npm 而不是 pnpm，请检查：

1. 项目中是否还存在 `package-lock.json` 文件
2. 是否已删除 `node_modules` 目录并重新使用 pnpm 安装依赖
3. Qoder IDE 是否已重启以重新检测项目配置

### 2. 依赖安装问题

如果遇到依赖安装问题：

```bash
# 清理并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. 版本冲突

如果遇到版本冲突问题：

```bash
# 更新 pnpm
pnpm add -g pnpm

# 重新安装依赖
pnpm install
```

## 结论

通过以上配置，Qoder IDE 应该能够正确识别并使用 pnpm 作为包管理器。这将提高依赖安装速度，节省磁盘空间，并确保团队成员之间的一致性。