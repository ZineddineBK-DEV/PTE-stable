#!/usr/bin/env bash
#
# REVERT_LAZY_LOADING.sh
#
# Reverts to the old monolith DashboardModule architecture.
# Restores the original app-routing.module.ts and dashboard.module.ts
# from their git versions.
#
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/src/app"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Reverting to monolith DashboardModule                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if we can restore from git
cd "$SCRIPT_DIR"

if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Restoring original files from git..."

    # Restore app-routing.module.ts
    if git checkout HEAD -- src/app/app-routing.module.ts 2>/dev/null; then
        echo "✓ Restored app-routing.module.ts"
    else
        echo "! app-routing.module.ts not in git - manual restore needed"
    fi

    # Restore dashboard.module.ts
    if git checkout HEAD -- src/app/dashboard/dashboard.module.ts 2>/dev/null; then
        echo "✓ Restored dashboard/dashboard.module.ts"
    else
        echo "! dashboard.module.ts not in git - manual restore needed"
    fi

    # Restore dashboard-routing.module.ts
    if git checkout HEAD -- src/app/dashboard/dashboard-routing.module.ts 2>/dev/null; then
        echo "✓ Restored dashboard/dashboard-routing.module.ts"
    else
        echo "! dashboard-routing.module.ts not in git - manual restore needed"
    fi
else
    echo "! Not a git repo. You need to manually restore:"
    echo "  1. src/app/app-routing.module.ts       → revert to load DashboardModule"
    echo "  2. src/app/dashboard/dashboard.module.ts → restore all declarations"
    echo "  3. src/app/dashboard/dashboard-routing.module.ts → restore all routes"
fi

# Feature modules can stay (they won't be loaded if not in routing)
echo ""
echo "Note: dashboard/modules/ directory is left in place (harmless)."
echo "      Delete it with: rm -rf src/app/dashboard/modules/"
echo ""
echo "✓ Revert complete. Run 'ng serve' to verify."
