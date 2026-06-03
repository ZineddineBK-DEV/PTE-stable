#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# PTE Redesign — Activate All Redesigned Templates
# Run this script to swap all original templates with redesigned versions
# Usage: bash ACTIVATE_REDESIGN.sh
# ═══════════════════════════════════════════════════════════════════════

BASEDIR="frontend/src/app"

echo "🔄 PTE Redesign — Activating redesigned templates..."
echo ""

# Function to swap template
swap_template() {
  local component_path="$1"
  local original="$2"
  local redesigned="$3"
  local full_path="$BASEDIR/$component_path"
  
  if [ -f "$full_path/$redesigned" ]; then
    # Backup original
    if [ -f "$full_path/$original" ]; then
      cp "$full_path/$original" "$full_path/${original}.original"
      echo "  ✅ Backed up: $component_path/$original"
    fi
    # Copy redesigned as the active template
    cp "$full_path/$redesigned" "$full_path/$original"
    echo "  🎨 Activated: $component_path/$redesigned → $original"
  else
    echo "  ⚠️  Not found: $component_path/$redesigned"
  fi
}

echo "━━━ Auth Pages ━━━"
swap_template "authentication/signin" "signin.component.html" "signin-redesigned.component.html"
swap_template "authentication/signup" "signup.component.html" "signup-redesigned.component.html"
swap_template "authentication/forgot" "forgot.component.html" "forgot-redesigned.component.html"
swap_template "authentication/code" "code.component.html" "code-redesigned.component.html"
swap_template "authentication/reset" "reset.component.html" "reset-redesigned.component.html"
swap_template "authentication/page404" "page404.component.html" "page404-redesigned.component.html"

echo ""
echo "━━━ Dashboard Pages ━━━"
swap_template "dashboard/main" "main.component.html" "main-redesigned.component.html"
swap_template "dashboard/user-list" "user-list.component.html" "user-list-redesigned.component.html"
swap_template "dashboard/user-request" "user-request.component.html" "user-request-redesigned.component.html"
swap_template "dashboard/external-user" "external-user.component.html" "external-user-redesigned.component.html"
swap_template "dashboard/interns-request" "interns-request.component.html" "interns-request-redesigned.component.html"
swap_template "dashboard/leave" "leave.component.html" "leave-redesigned.component.html"
swap_template "dashboard/leave/my-leave-requests" "my-leave-requests.component.html" "my-leave-requests-redesigned.component.html"
swap_template "dashboard/room" "room.component.html" "room-redesigned.component.html"
swap_template "dashboard/vehicle" "vehicle.component.html" "vehicle-redesigned.component.html"
swap_template "dashboard/technician" "technician.component.html" "technician-redesigned.component.html"
swap_template "dashboard/virtualisation-environment" "virtualisation-environment.component.html" "virtualisation-environment-redesigned.component.html"
swap_template "dashboard/virtualisation-environment/my-requests" "my-requests.component.html" "my-requests-redesigned.component.html"
swap_template "dashboard/profile" "profile.component.html" "profile-redesigned.component.html"
swap_template "dashboard/inventory" "inventory.component.html" "inventory-redesigned.component.html"
swap_template "dashboard/offers" "offers.component.html" "offers-redesigned.component.html"
swap_template "dashboard/network-requests" "network-requests.component.html" "network-requests-redesigned.component.html"

echo ""
echo "━━━ Newspaper ━━━"
swap_template "newspaper/all-news" "newspaper.component.html" "newspaper-redesigned.component.html"

echo ""
echo "✅ Done! All redesigned templates are now active."
echo "   Originals backed up as *.original files."
echo "   Run 'bash REVERT_REDESIGN.sh' to revert."
