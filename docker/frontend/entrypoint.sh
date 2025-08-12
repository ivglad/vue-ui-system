#!/usr/bin/env sh
set -e

# Ensure group-writable files for collaborative dev
umask 0002

# Prepare writable dirs
mkdir -p /var/www/frontend/node_modules /home/node/.npm /var/www/frontend/types

# Fix ownership for named volumes and caches (idempotent)
chown -R node:node /var/www/frontend/node_modules || true
chown -R node:node /home/node/.npm || true
chown -R node:node /var/www/frontend/types || true

# Fix ownership for auto-generated declaration files if they exist at root (legacy)
for f in /var/www/frontend/auto-imports.d.ts /var/www/frontend/components.d.ts; do
  if [ -e "$f" ]; then
    chown node:node "$f" || true
    chmod g+rw "$f" || true
  fi
done

# Show effective user and important paths
echo "[frontend] Running as (pre-drop): $(id)"
echo "[frontend] node_modules perms: $(stat -c '%U:%G %a' /var/www/frontend/node_modules 2>/dev/null || echo 'n/a')"
echo "[frontend] npm cache perms: $(stat -c '%U:%G %a' /home/node/.npm 2>/dev/null || echo 'n/a')"
echo "[frontend] types dir perms: $(stat -c '%U:%G %a' /var/www/frontend/types 2>/dev/null || echo 'n/a')"

# Show effective user after dropping privileges (for clarity in logs)
su-exec node sh -lc 'echo "[frontend] Running as (post-drop): $(id)"'

# Drop privileges to node and exec the command
exec su-exec node "$@"
