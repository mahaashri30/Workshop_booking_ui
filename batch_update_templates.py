#!/usr/bin/env python3
"""
Automated Template Updater - Premium Brutalist Design System
Converts old gradient styles to new minimal palette across all templates
"""

import re
from pathlib import Path

TEMPLATE_DIR = Path("workshop_app/templates/workshop_app")

# Transformation rules: (pattern, replacement)
TRANSFORMATIONS = [
    # Background gradients → light background
    (r'background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)', 
     "background-color: #fbfbfb"),
    
    (r'background:\s*linear-gradient\(135deg,\s*#2563eb\s*0%,\s*#1e40af\s*100%\)',
     "background-color: #f5f5f5"),
    
    # Large border-radius → minimal (3px)
    (r'border-radius:\s*16px',
     "border-radius: 3px"),
    
    (r'border-radius:\s*12px',
     "border-radius: 3px"),
    
    (r'border-radius:\s*8px',
     "border-radius: 3px"),
    
    # Thick borders → thin (1px)
    (r'border:\s*2px\s*solid\s*#2563eb',
     "border: 1px solid #517d8f"),
    
    (r'border:\s*2px\s*solid\s*#e2e8f0',
     "border: 1px solid #d4d4d4"),
    
    # Bright blue color → accent color
    (r'color:\s*#2563eb',
     "color: #517d8f"),
    
    (r'border-color:\s*#2563eb',
     "border-color: #517d8f"),
    
    # Bright blue background → light bg
    (r'background-color:\s*#2563eb',
     "background-color: #404653"),
    
    # Heavy shadows → minimal
    (r'box-shadow:\s*0\s*20px\s*60px\s*rgba\(0,\s*0,\s*0,\s*0\.3\)',
     "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"),
    
    (r'box-shadow:\s*0\s*10px\s*20px\s*rgba\(37,\s*99,\s*235,\s*0\.3\)',
     "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"),
    
    # Focus shadows → accent color
    (r'box-shadow:\s*0\s*0\s*0\s*3px\s*rgba\(37,\s*99,\s*235,\s*0\.1\)',
     "box-shadow: 0 0 0 2px rgba(81, 125, 143, 0.15)"),
    
    # Text colors
    (r'color:\s*#1e293b',
     "color: #404653"),
    
    (r'color:\s*#64748b',
     "color: #5a5a5a"),
    
    (r'color:\s*#94a3b8',
     "color: #a0a0a0"),
    
    # Background colors for forms
    (r'background-color:\s*#f8fafc',
     "background-color: #fbfbfb"),
]

def update_template(filepath):
    """Apply transformations to a single template"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for pattern, replacement in TRANSFORMATIONS:
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {filepath}: {e}")
        return False

def main():
    """Update all templates"""
    templates = list(TEMPLATE_DIR.glob("*.html"))
    updated = []
    skipped = []
    
    print(f"Updating {len(templates)} templates...\n")
    
    for template in sorted(templates):
        if update_template(template):
            updated.append(template.name)
            print(f"✅ Updated: {template.name}")
        else:
            skipped.append(template.name)
            print(f"⏭️  Skipped: {template.name}")
    
    print(f"\n{'='*50}")
    print(f"Updated: {len(updated)} | Skipped: {len(skipped)}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
