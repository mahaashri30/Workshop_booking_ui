#!/usr/bin/env python3
"""
Template Update Script - Premium Brutalist Design System
Identifies templates with old gradient styles and prepares them for update
"""

import os
import re
from pathlib import Path

# Base directory for templates
TEMPLATE_DIR = Path("workshop_app/templates/workshop_app")

# Patterns to find old gradient styles
OLD_PATTERNS = {
    "gradient_bg": r"background:\s*linear-gradient\([^)]*\)",
    "bright_blue": r"#2563eb|#1e40af|#667eea|#764ba2",
    "large_radius": r"border-radius:\s*1[2-9]px|border-radius:\s*16px",
    "thick_border": r"border:\s*2px\s*solid",
    "old_shadow": r"box-shadow:\s*0\s*(?:20|10|4)\s*px.*rgba\(.*(?:0\.|0\.3)\)",
}

def analyze_template(filepath):
    """Analyze a template for old gradient styles"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        issues = {}
        for pattern_name, pattern in OLD_PATTERNS.items():
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                issues[pattern_name] = len(matches)
        
        return issues if issues else None
    except Exception as e:
        print(f"Error analyzing {filepath}: {e}")
        return None

def main():
    """Main analysis function"""
    templates_found = []
    files_needing_update = []
    
    if not TEMPLATE_DIR.exists():
        print(f"Template directory not found: {TEMPLATE_DIR}")
        return
    
    print("🔍 Scanning templates for old gradient styles...\n")
    
    for template_file in sorted(TEMPLATE_DIR.glob("*.html")):
        templates_found.append(template_file.name)
        issues = analyze_template(template_file)
        
        if issues:
            files_needing_update.append((template_file.name, issues))
    
    print(f"Found {len(templates_found)} total templates")
    print(f"Found {len(files_needing_update)} templates needing updates\n")
    
    print("=== Templates Needing Updates ===")
    for filename, issues in sorted(files_needing_update):
        print(f"\n📄 {filename}")
        for issue_type, count in issues.items():
            print(f"   - {issue_type}: {count} match(es)")
    
    print("\n=== Already Updated ===")
    updated = set(t for t, _ in templates_found) - set(f for f, _ in files_needing_update)
    for name in sorted(updated):
        print(f"   ✅ {name}")

if __name__ == "__main__":
    main()
