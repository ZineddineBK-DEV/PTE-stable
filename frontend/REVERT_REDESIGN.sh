#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# PTE Redesign — Revert to Original Templates
# Restores all original templates from .original backup files
# Usage: bash REVERT_REDESIGN.sh
# ═══════════════════════════════════════════════════════════════════════

BASEDIR="frontend/src/app"

echo "⏪ Reverting to original templates..."

find "$BASEDIR" -name "*.original" | while read backup; do
  original="${backup%.original}"
  cp "$backup" "$original"
  rm "$backup"
  echo "  ✅ Restored: ${original#$BASEDIR/}"
done

echo ""
echo "✅ All templates reverted to originals."
