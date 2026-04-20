# Yunxiao CD To ECS

这个方案只负责 CD：

- 镜像构建和推送继续由 GitHub Actions 完成
- 云效流水线仅负责拉取 ACR 镜像并部署到 ECS

---

## 1. 已提供文件

- 流水线 YAML：`/.yunxiao/pipelines/cd-ecs.yaml`
- 部署脚本：`/ci/yunxiao/deploy-ecs.sh`

---

## 2. 在云效中导入 YAML

1. 新建 Flow 流水线，选择 YAML 模式。
2. 复制 `/.yunxiao/pipelines/cd-ecs.yaml` 内容到云效。
3. 按你自己的仓库修改这两个占位值：
- `sources.repo.endpoint`
- `sources.repo.certificate.serviceConnection`
4. 把 `variableGroups` 改成你自己的变量组 ID。

---

## 3. 变量组建议

下面变量建议放在云效变量组里，密钥类变量请设置为“私密变量”。

### 必填变量

- `ACR_LOGIN_SERVER`
  示例：`your-registry.cn-beijing.cr.aliyuncs.com`
- `ACR_NAMESPACE`
  示例：`mushan`
- `ECS_PROD_HOST`
  示例：`47.xx.xx.xx`
- `ECS_SSH_PRIVATE_KEY_B64` 或 `ECS_SSH_PRIVATE_KEY`
  推荐用 `ECS_SSH_PRIVATE_KEY_B64`

### 推荐私密变量

- `ACR_USERNAME`
- `ACR_PASSWORD`
- `ECS_KNOWN_HOSTS`
  可选。填了会强校验主机指纹，不填则流水线会执行 `ssh-keyscan` 自动拉取。

### 可选变量（按需覆盖）

- `ECS_PROD_USER` 默认 `root`
- `ECS_PROD_PORT` 默认 `22`
- `ECS_PROD_CONTAINER_NAME` 默认 `mushan-blog`
- `ECS_PROD_BIND_IP` 默认 `127.0.0.1`
- `ECS_PROD_HOST_PORT` 默认 `3000`
- `ECS_PROD_CONTAINER_PORT` 默认 `3000`
- `ECS_PROD_ENV_FILE` 默认 `/root/project/mushan-blog/.env.production`

开发环境可选（`dev` 分支）：

- `ECS_DEV_HOST`（不填则 `dev` 分支自动跳过部署）
- `ECS_DEV_USER`、`ECS_DEV_PORT`
- `ECS_DEV_CONTAINER_NAME` 默认 `mushan-blog-dev`
- `ECS_DEV_HOST_PORT` 默认 `3001`
- `ECS_DEV_CONTAINER_PORT` 默认 `3000`
- `ECS_DEV_ENV_FILE` 默认 `/root/project/mushan-blog/.env.preview`

其他：

- `IMAGE_TAG_OVERRIDE` 手动覆盖镜像 tag（默认自动用 `sha-${CI_COMMIT_SHA}`，找不到再回退 `latest`）
- `ECS_HEALTHCHECK_PATH` 默认 `/api/health`
- `ECS_EXTRA_RUN_ARGS` 额外 `docker run` 参数（例如 `--add-host xxx:1.2.3.4`）

---

## 4. 分支与镜像映射

- `main` 分支 -> 拉取仓库 `mushan-blog`
- `dev` 分支 -> 拉取仓库 `mushan-blog-dev`

镜像 tag 默认优先 `sha-${CI_COMMIT_SHA}`，拉取失败自动回退 `latest`。

---

## 5. ECS 前置要求

- ECS 安装 Docker
- ECS 能访问你的 ACR
- ECS 上准备好运行时环境文件（例如 `/root/project/mushan-blog/.env.production`）
- Nginx 反向代理继续指向容器端口（默认 `127.0.0.1:3000`）

---

## 6. 首次验证

1. 先在 ECS 手动执行一次：

```bash
docker login <ACR_LOGIN_SERVER>
docker pull <ACR_LOGIN_SERVER>/<ACR_NAMESPACE>/mushan-blog:latest
```

2. 再在云效手动触发一次流水线，确认部署日志包含：
- `Pull ...`
- `name=mushan-blog image=... status=Up ...`
- `health check passed`

---

## 7. 安全建议

- `ACR_PASSWORD`、SSH 私钥必须用私密变量，不要写在 YAML。
- 推荐使用专用 ACR 子账号，不要使用主账号密码。
- 推荐配置 `ECS_KNOWN_HOSTS` 固定主机指纹，避免中间人风险。
- ECS 上只开放 Nginx 的 443，容器端口用 `127.0.0.1` 绑定即可。
