#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[yunxiao-cd] %s\n' "$*"
}

die() {
  printf '[yunxiao-cd][error] %s\n' "$*" >&2
  exit 1
}

escape_single_quote() {
  printf '%s' "$1" | sed "s/'/'\\\\''/g"
}

ensure_ssh_client() {
  if command -v ssh >/dev/null 2>&1 && command -v ssh-keyscan >/dev/null 2>&1; then
    return
  fi

  log 'Installing openssh client...'
  if command -v dnf >/dev/null 2>&1; then
    dnf install -y openssh-clients >/dev/null
    return
  fi

  if command -v yum >/dev/null 2>&1; then
    yum install -y openssh-clients >/dev/null
    return
  fi

  if command -v apk >/dev/null 2>&1; then
    apk add --no-cache openssh-client >/dev/null
    return
  fi

  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -y >/dev/null
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends openssh-client >/dev/null
    return
  fi

  die 'Unable to install openssh client on current runner image.'
}

prepare_ssh_key() {
  mkdir -p "${HOME}/.ssh"
  chmod 700 "${HOME}/.ssh"

  local key_file="${HOME}/.ssh/id_rsa"
  if [ -n "${ECS_SSH_PRIVATE_KEY_B64:-}" ]; then
    if printf '%s' "${ECS_SSH_PRIVATE_KEY_B64}" | base64 -d >"${key_file}" 2>/dev/null; then
      :
    elif printf '%s' "${ECS_SSH_PRIVATE_KEY_B64}" | base64 --decode >"${key_file}" 2>/dev/null; then
      :
    else
      die 'ECS_SSH_PRIVATE_KEY_B64 is not valid base64 content.'
    fi
  elif [ -n "${ECS_SSH_PRIVATE_KEY:-}" ]; then
    printf '%s\n' "${ECS_SSH_PRIVATE_KEY}" >"${key_file}"
  else
    die 'Please provide ECS_SSH_PRIVATE_KEY_B64 or ECS_SSH_PRIVATE_KEY.'
  fi

  chmod 600 "${key_file}"
}

prepare_known_hosts() {
  local host="$1"
  local port="$2"
  local known_hosts_file="${HOME}/.ssh/known_hosts"

  if [ -n "${ECS_KNOWN_HOSTS:-}" ]; then
    printf '%s\n' "${ECS_KNOWN_HOSTS}" >"${known_hosts_file}"
  else
    if ! ssh-keyscan -T 15 -p "${port}" -H "${host}" >"${known_hosts_file}" 2>/dev/null; then
      die "Failed to fetch host key for ${host}:${port}."
    fi
  fi

  chmod 644 "${known_hosts_file}"
}

require_var() {
  local key="$1"
  if [ -z "${!key:-}" ]; then
    die "Missing required variable: ${key}"
  fi
}

require_var ACR_LOGIN_SERVER
require_var ACR_NAMESPACE
require_var ACR_REPOSITORY

branch="${CI_COMMIT_REF_NAME:-main}"
sha="${CI_COMMIT_SHA:-}"

image_repo_suffix=''
target_host=''
target_user='root'
target_port='22'
target_container_name='mushan-blog'
target_bind_ip='127.0.0.1'
target_host_port='3000'
target_container_port='3000'
target_env_file='/root/project/mushan-blog/.env.production'
target_extra_run_args="${ECS_EXTRA_RUN_ARGS:-}"

case "${branch}" in
  main | master)
    require_var ECS_PROD_HOST
    target_host="${ECS_PROD_HOST}"
    target_user="${ECS_PROD_USER:-root}"
    target_port="${ECS_PROD_PORT:-22}"
    target_container_name="${ECS_PROD_CONTAINER_NAME:-mushan-blog}"
    target_bind_ip="${ECS_PROD_BIND_IP:-127.0.0.1}"
    target_host_port="${ECS_PROD_HOST_PORT:-3000}"
    target_container_port="${ECS_PROD_CONTAINER_PORT:-3000}"
    target_env_file="${ECS_PROD_ENV_FILE:-/root/project/mushan-blog/.env.production}"
    ;;
  dev | develop)
    if [ -z "${ECS_DEV_HOST:-}" ]; then
      log "ECS_DEV_HOST is empty. Skip deploy for branch ${branch}."
      exit 0
    fi

    image_repo_suffix='-dev'
    target_host="${ECS_DEV_HOST}"
    target_user="${ECS_DEV_USER:-${ECS_PROD_USER:-root}}"
    target_port="${ECS_DEV_PORT:-${ECS_PROD_PORT:-22}}"
    target_container_name="${ECS_DEV_CONTAINER_NAME:-mushan-blog-dev}"
    target_bind_ip="${ECS_DEV_BIND_IP:-127.0.0.1}"
    target_host_port="${ECS_DEV_HOST_PORT:-3001}"
    target_container_port="${ECS_DEV_CONTAINER_PORT:-3000}"
    target_env_file="${ECS_DEV_ENV_FILE:-/root/project/mushan-blog/.env.preview}"
    ;;
  *)
    log "Branch ${branch} is not configured for ECS CD. Skip."
    exit 0
    ;;
esac

image_repo="${ACR_REPOSITORY}${image_repo_suffix}"
if [ -n "${IMAGE_TAG_OVERRIDE:-}" ]; then
  image_tag="${IMAGE_TAG_OVERRIDE}"
elif [ -n "${sha}" ]; then
  image_tag="sha-${sha}"
else
  image_tag='latest'
fi

image="${ACR_LOGIN_SERVER}/${ACR_NAMESPACE}/${image_repo}:${image_tag}"
fallback_image="${ACR_LOGIN_SERVER}/${ACR_NAMESPACE}/${image_repo}:latest"
healthcheck_path="${ECS_HEALTHCHECK_PATH:-/api/health}"

log "Branch=${branch}, target=${target_user}@${target_host}:${target_port}, image=${image}"

ensure_ssh_client
prepare_ssh_key
prepare_known_hosts "${target_host}" "${target_port}"

remote_env="ACR_LOGIN_SERVER='$(escape_single_quote "${ACR_LOGIN_SERVER}")' \
ACR_USERNAME='$(escape_single_quote "${ACR_USERNAME:-}")' \
ACR_PASSWORD='$(escape_single_quote "${ACR_PASSWORD:-}")' \
IMAGE='$(escape_single_quote "${image}")' \
IMAGE_FALLBACK='$(escape_single_quote "${fallback_image}")' \
CONTAINER_NAME='$(escape_single_quote "${target_container_name}")' \
BIND_IP='$(escape_single_quote "${target_bind_ip}")' \
HOST_PORT='$(escape_single_quote "${target_host_port}")' \
CONTAINER_PORT='$(escape_single_quote "${target_container_port}")' \
ENV_FILE='$(escape_single_quote "${target_env_file}")' \
HEALTHCHECK_PATH='$(escape_single_quote "${healthcheck_path}")' \
EXTRA_RUN_ARGS='$(escape_single_quote "${target_extra_run_args}")'"

ssh -i "${HOME}/.ssh/id_rsa" \
  -p "${target_port}" \
  -o BatchMode=yes \
  -o StrictHostKeyChecking=yes \
  -o UserKnownHostsFile="${HOME}/.ssh/known_hosts" \
  "${target_user}@${target_host}" \
  "${remote_env} bash -se" <<'REMOTE'
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo '[remote][error] docker is not installed on ECS.' >&2
  exit 1
fi

if [ -n "${ACR_USERNAME}" ] && [ -n "${ACR_PASSWORD}" ]; then
  docker login "${ACR_LOGIN_SERVER}" -u "${ACR_USERNAME}" -p "${ACR_PASSWORD}" >/dev/null
fi

image_to_run="${IMAGE}"
if ! docker pull "${IMAGE}" >/dev/null 2>&1; then
  echo "[remote] Pull ${IMAGE} failed, fallback to ${IMAGE_FALLBACK}"
  docker pull "${IMAGE_FALLBACK}" >/dev/null
  image_to_run="${IMAGE_FALLBACK}"
fi

if docker ps -a --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
  docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
fi

run_args=(
  -d
  --name "${CONTAINER_NAME}"
  --restart unless-stopped
  -p "${BIND_IP}:${HOST_PORT}:${CONTAINER_PORT}"
)

if [ -n "${ENV_FILE}" ] && [ -f "${ENV_FILE}" ]; then
  run_args+=(--env-file "${ENV_FILE}")
fi

if [ -n "${EXTRA_RUN_ARGS}" ]; then
  # shellcheck disable=SC2206
  extra_args=( ${EXTRA_RUN_ARGS} )
  run_args+=("${extra_args[@]}")
fi

docker run "${run_args[@]}" "${image_to_run}" >/dev/null
docker ps --filter "name=^/${CONTAINER_NAME}$" --format 'name={{.Names}} image={{.Image}} status={{.Status}}'

if [ -n "${HEALTHCHECK_PATH}" ] && command -v curl >/dev/null 2>&1; then
  for _ in $(seq 1 20); do
    if curl -fsS "http://127.0.0.1:${HOST_PORT}${HEALTHCHECK_PATH}" >/dev/null; then
      echo "[remote] health check passed: ${HEALTHCHECK_PATH}"
      exit 0
    fi
    sleep 2
  done
  echo "[remote][error] health check failed: ${HEALTHCHECK_PATH}" >&2
  exit 1
fi
REMOTE

log 'Deploy finished.'
