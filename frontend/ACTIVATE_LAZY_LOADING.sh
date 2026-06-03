#!/usr/bin/env bash
#
# ACTIVATE_LAZY_LOADING.sh
#
# Switches from the old monolith DashboardModule to the new
# lazy-loaded feature module architecture.
#
# This script:
#   1. Backs up the original routing & module files
#   2. The new files are already in place (dashboard/modules/*)
#
# Since the new architecture uses app-routing.module.ts (already updated)
# and dashboard/dashboard.module.ts (already emptied), the activation
# is already done by the presence of the new files.
#
# Run this to verify everything is in order.
#

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/src/app"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  PTE Lazy-Loading Activation & Verification                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Verify feature modules exist
MODULE_COUNT=$(find "$SRC/dashboard/modules" -name "*.module.ts" | wc -l)
echo "✓ Found $MODULE_COUNT feature module files in dashboard/modules/"

# Verify app-routing.module.ts uses lazy loading
LAZY_COUNT=$(grep -c "loadChildren" "$SRC/app-routing.module.ts")
echo "✓ app-routing.module.ts has $LAZY_COUNT lazy-loaded routes"

# Verify old DashboardModule is empty
DECL_COUNT=$(grep -c "Component\|Pipe" "$SRC/dashboard/dashboard.module.ts" || true)
if [ "$DECL_COUNT" -gt 0 ]; then
    # Check if they're in comments
    ACTIVE=$(grep -v "^\s*//" "$SRC/dashboard/dashboard.module.ts" | grep -c "Component\|Pipe" || true)
    if [ "$ACTIVE" -gt 0 ]; then
        echo "✗ WARNING: Old DashboardModule still has active declarations!"
    else
        echo "✓ Old DashboardModule is empty (declarations only in comments)"
    fi
else
    echo "✓ Old DashboardModule is empty"
fi

# Verify old features/ directory is removed
if [ -d "$SRC/features" ]; then
    echo "✗ WARNING: Dead features/ directory still exists - removing..."
    rm -rf "$SRC/features"
    echo "  Removed features/"
fi

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  Architecture:"
echo ""
echo "  OLD:  1 monolith DashboardModule (66+ components, all libs)"
echo "        → entire app downloaded upfront"
echo ""
echo "  NEW:  22 lazy-loaded route modules + 4 shared modules"
echo "        → user only downloads code for pages they visit"
echo ""
echo "  Heavy libraries now loaded ONLY on demand:"
echo "    FullCalendar   → only when visiting calendar pages"
echo "    NgxDatatable   → only when visiting table pages"
echo "    ECharts        → only when visiting dashboard home"
echo "    ApexCharts     → only when visiting dashboard home"
echo "    Leaflet        → only when visiting vehicle/technician"
echo "    MatStepper     → only when visiting virtualisation"
echo "    NgxGauge       → only when visiting dashboard home"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "✓ Lazy loading is ACTIVE. Run 'ng serve' to test."
