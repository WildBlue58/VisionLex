# OpenSpec Agent 工作指南

本文档说明 AI 助手如何在此项目中使用 OpenSpec 进行协作。

## 何时使用 OpenSpec

当你收到以下类型的请求时，**必须先阅读 `openspec/project.md`**，然后根据需要创建或应用变更提案：

- **规划相关**：proposal、spec、change、plan 等词汇
- **新功能**：引入新能力、功能扩展
- **重大变更**：breaking changes、架构调整
- **性能和安全**：性能优化、安全相关的工作
- **模糊请求**：需要先明确规范再编码的情况

## 工作流程

### 1. 创建变更提案 (Change Proposal)

当用户提出新需求或更改时：

1. 在 `openspec/changes/[feature-name]/` 目录下创建：
   - `proposal.md` - 变更提案，包含：
     - 背景和动机
     - 目标
     - 范围
     - 约束条件
   - `design.md` - 设计文档（可选），包含：
     - 技术方案
     - API 设计
     - 数据结构
     - 实现细节

2. 提案命名规则：
   - 使用 kebab-case（短横线分隔）
   - 描述性强，例如：`enhance-production-ready`、`add-user-authentication`

### 2. 应用变更提案

1. 先与用户确认提案内容
2. 根据 `design.md`（如有）或 `proposal.md` 实施代码
3. 完成后标记提案为已实现（可通过 Git 提交信息引用）

### 3. 读取项目规范

开始任何工作前，务必先读取 `openspec/project.md` 了解：

- 技术栈和版本
- 代码规范和约定
- 项目结构
- 依赖关系

## 文件结构

```
openspec/
├── AGENTS.md          # 本文档（AI 助手指南）
├── project.md         # 项目规范和技术栈详情
└── changes/           # 变更提案目录
    └── [feature-name]/
        ├── proposal.md # 变更提案
        └── design.md   # 设计文档（可选）
```

## 最佳实践

1. **先规划后编码**：对于复杂变更，先创建提案再实施
2. **保持同步**：实施变更时遵循提案中的设计
3. **文档驱动**：重要决策记录在提案中
4. **迭代改进**：提案可以多次修订，但要保持版本清晰

## 与用户协作

- 创建提案后，等待用户确认再开始实施
- 实施过程中如有偏离，及时沟通并更新提案
- 完成实施后，引用提案编号便于追溯
