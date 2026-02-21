#!/usr/bin/env bash
set -euo pipefail

# Sync shared assets from CRX source tree to fpk tree.
# Rules:
# - Only sync files explicitly mapped below.
# - Only sync when source and destination both already exist.
# - Never create or delete files; copy is overwrite-only.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

readonly MAPPINGS=(
  "basic_mod.css:fpk/FnOS_UI_Mods/app/www/assets/templates/basic_mod.css"
  "mac_titlebar_mod.css:fpk/FnOS_UI_Mods/app/www/assets/templates/mac_titlebar_mod.css"
  "windows_titlebar_mod.css:fpk/FnOS_UI_Mods/app/www/assets/templates/windows_titlebar_mod.css"
  "mod.js:fpk/FnOS_UI_Mods/app/www/assets/templates/mod.js"
  "spotlight_launchpad_mod.css:fpk/FnOS_UI_Mods/app/www/assets/templates/spotlight_launchpad_mod.css"
  "classic_launchpad_mod.css:fpk/FnOS_UI_Mods/app/www/assets/templates/classic_launchpad_mod.css"
  "fonts/SarasaMonoSC-SemiBold.ttf:fpk/FnOS_UI_Mods/app/www/fonts/SarasaMonoSC-SemiBold.ttf"
  "fonts/SarasaUiSC-SemiBold.ttf:fpk/FnOS_UI_Mods/app/www/fonts/SarasaUiSC-SemiBold.ttf"
)
readonly DIR_MAPPINGS=(
  "prefect_icon:fpk/FnOS_UI_Mods/app/www/prefect_icon"
)

updated=0
skipped=0
total=0

sync_pair() {
  local src_rel="$1"
  local dst_rel="$2"
  src="${REPO_ROOT}/${src_rel}"
  dst="${REPO_ROOT}/${dst_rel}"
  ((total+=1))

  if [[ ! -f "${src}" ]]; then
    echo "SKIP (missing source): ${src_rel}"
    ((skipped+=1))
    continue
  fi

  if [[ ! -f "${dst}" ]]; then
    echo "SKIP (missing target): ${dst_rel}"
    ((skipped+=1))
    continue
  fi

  if cmp -s "${src}" "${dst}"; then
    echo "UNCHANGED: ${src_rel}"
    continue
  fi

  cp -f "${src}" "${dst}"
  echo "UPDATED: ${src_rel} -> ${dst_rel}"
  ((updated+=1))
}

for mapping in "${MAPPINGS[@]}"; do
  src_rel="${mapping%%:*}"
  dst_rel="${mapping#*:}"
  sync_pair "${src_rel}" "${dst_rel}"
done

for mapping in "${DIR_MAPPINGS[@]}"; do
  src_dir_rel="${mapping%%:*}"
  dst_dir_rel="${mapping#*:}"
  src_dir="${REPO_ROOT}/${src_dir_rel}"
  dst_dir="${REPO_ROOT}/${dst_dir_rel}"

  if [[ ! -d "${src_dir}" ]]; then
    echo "SKIP (missing source dir): ${src_dir_rel}"
    continue
  fi
  if [[ ! -d "${dst_dir}" ]]; then
    echo "SKIP (missing target dir): ${dst_dir_rel}"
    continue
  fi

  while IFS= read -r src_path; do
    rel="${src_path#${src_dir}/}"
    src_rel="${src_dir_rel}/${rel}"
    dst_rel="${dst_dir_rel}/${rel}"
    sync_pair "${src_rel}" "${dst_rel}"
  done < <(find "${src_dir}" -type f | sort)
done

echo
echo "Done. updated=${updated}, skipped=${skipped}, total=${total}"
