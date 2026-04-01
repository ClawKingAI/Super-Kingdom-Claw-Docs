#!/usr/bin/env python3
"""
Context Scanner - Security scanner for context files.

Scans SOUL.md, AGENTS.md, MEMORY.md, and other context files
for prompt injection attempts before loading into system prompt.

Based on Hermes Agent's skills_guard.py and prompt_builder.py patterns.
"""

import re
import logging
from pathlib import Path
from typing import Optional, List, Tuple

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Threat patterns for context files
# (Subset of Hermes skills_guard patterns relevant to context injection)
# ---------------------------------------------------------------------------

CONTEXT_THREAT_PATTERNS = [
    # Prompt injection
    (r'ignore\s+(previous|all|above|prior)\s+instructions', "prompt_injection_ignore", "critical"),
    (r'you\s+are\s+now\s+', "role_hijack", "high"),
    (r'do\s+not\s+tell\s+the\s+user', "deception_hide", "critical"),
    (r'system\s+prompt\s+override', "sys_prompt_override", "critical"),
    (r'disregard\s+(your|all|any)\s+(instructions|rules|guidelines)', "disregard_rules", "critical"),
    (r'act\s+as\s+(if|though)\s+you\s+(have\s+no|don\'t\s+have)\s+(restrictions|limits|rules)', "bypass_restrictions", "critical"),
    (r'pretend\s+(?:\w+\s+)*(you\s+are|to\s+be)\s+', "role_pretend", "high"),
    
    # Exfiltration via curl/wget with secrets
    (r'curl\s+[^\n]*\$\{?\w*(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|API)', "exfil_curl", "critical"),
    (r'wget\s+[^\n]*\$\{?\w*(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|API)', "exfil_wget", "critical"),
    (r'cat\s+[^\n]*(\.env|credentials|\.netrc|\.pgpass)', "read_secrets", "critical"),
    
    # Hidden instructions in HTML
    (r'<!--[^>]*(?:ignore|override|system|secret|hidden)[^>]*-->', "html_comment_injection", "high"),
    (r'<\s*div\s+style\s*=\s*["\'].*display\s*:\s*none', "hidden_div", "high"),
    
    # Translate-then-execute evasion
    (r'translate\s+.*\s+into\s+.*\s+and\s+(execute|run|eval)', "translate_execute", "critical"),
    
    # Jailbreak patterns
    (r'\bDAN\s+mode\b|Do\s+Anything\s+Now', "jailbreak_dan", "critical"),
    (r'\bdeveloper\s+mode\b.*\benabled?\b', "jailbreak_dev_mode", "critical"),
    
    # Agent config persistence
    (r'AGENTS\.md|CLAUDE\.md|\.cursorrules|\.clinerules', "agent_config_reference", "high"),
]

# Invisible unicode characters used for injection
INVISIBLE_CHARS = {
    '\u200b',  # zero-width space
    '\u200c',  # zero-width non-joiner
    '\u200d',  # zero-width joiner
    '\u2060',  # word joiner
    '\u2062',  # invisible times
    '\u2063',  # invisible separator
    '\u2064',  # invisible plus
    '\ufeff',  # zero-width no-break space (BOM)
    '\u202a',  # left-to-right embedding
    '\u202b',  # right-to-left embedding
    '\u202c',  # pop directional formatting
    '\u202d',  # left-to-right override
    '\u202e',  # right-to-left override
}

# Maximum content length to scan (prevent DoS)
MAX_SCAN_LENGTH = 100_000


class ScanResult:
    """Result of scanning a context file."""
    def __init__(
        self,
        file_path: str,
        is_safe: bool,
        findings: List[Tuple[str, str, str]],  # (pattern_id, severity, description)
        blocked_reason: Optional[str] = None,
    ):
        self.file_path = file_path
        self.is_safe = is_safe
        self.findings = findings
        self.blocked_reason = blocked_reason


def scan_content(content: str, filename: str) -> ScanResult:
    """
    Scan context file content for injection/exfiltration patterns.
    
    Args:
        content: The file content to scan
        filename: Name of the file (for error messages)
    
    Returns:
        ScanResult with safety status and any findings
    """
    if not content:
        return ScanResult(filename, True, [])
    
    # Truncate for safety
    if len(content) > MAX_SCAN_LENGTH:
        content = content[:MAX_SCAN_LENGTH]
    
    findings = []
    has_critical = False
    
    # Check invisible unicode
    for char in INVISIBLE_CHARS:
        if char in content:
            char_name = _unicode_char_name(char)
            findings.append(("invisible_unicode", "high", f"Invisible unicode U+{ord(char):04X} ({char_name})"))
    
    # Check threat patterns
    for pattern, pattern_id, severity in CONTEXT_THREAT_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            findings.append((pattern_id, severity, f"Matched pattern: {pattern_id}"))
            if severity == "critical":
                has_critical = True
    
    # Determine if blocked
    is_safe = not has_critical and len(findings) == 0
    blocked_reason = None
    
    if has_critical:
        critical_findings = [f for f in findings if f[1] == "critical"]
        blocked_reason = f"Blocked: {filename} contained {len(critical_findings)} critical pattern(s)"
    
    return ScanResult(filename, is_safe, findings, blocked_reason)


def scan_file(file_path: Path) -> ScanResult:
    """Scan a file on disk."""
    try:
        content = file_path.read_text(encoding='utf-8')
        return scan_content(content, str(file_path))
    except Exception as e:
        logger.warning("Failed to scan %s: %s", file_path, e)
        return ScanResult(str(file_path), True, [])  # Safe on error (log only)


def safe_load_context(file_path: Path) -> str:
    """
    Load a context file safely, scanning for injection.
    
    Returns:
        File content if safe, or blocked message if dangerous
    """
    if not file_path.exists():
        return ""
    
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        logger.warning("Could not read %s: %s", file_path, e)
        return ""
    
    result = scan_content(content, file_path.name)
    
    if result.is_safe:
        return content
    
    if result.blocked_reason:
        logger.warning("Context file blocked: %s", result.blocked_reason)
        return f"[BLOCKED: {result.blocked_reason}]"
    
    return content


def _unicode_char_name(char: str) -> str:
    """Get a readable name for an invisible unicode character."""
    names = {
        '\u200b': "zero-width space",
        '\u200c': "zero-width non-joiner",
        '\u200d': "zero-width joiner",
        '\u2060': "word joiner",
        '\u2062': "invisible times",
        '\u2063': "invisible separator",
        '\u2064': "invisible plus",
        '\ufeff': "BOM/zero-width no-break space",
        '\u202a': "LTR embedding",
        '\u202b': "RTL embedding",
        '\u202c': "pop directional",
        '\u202d': "LTR override",
        '\u202e': "RTL override",
    }
    return names.get(char, f"U+{ord(char):04X}")


# Convenience function for OpenClaw integration
def scan_context_files(workspace_path: Path) -> dict:
    """
    Scan all context files in a workspace.
    
    Args:
        workspace_path: Root directory of the workspace
    
    Returns:
        Dict with 'safe', 'warnings', 'blocked' lists
    """
    context_files = [
        "SOUL.md",
        "AGENTS.md", 
        "MEMORY.md",
        "USER.md",
        "BOOT.md",
        ".cursorrules",
        "CLAUDE.md",
    ]
    
    results = {
        'safe': [],
        'warnings': [],
        'blocked': [],
    }
    
    for filename in context_files:
        file_path = workspace_path / filename
        if file_path.exists():
            result = scan_file(file_path)
            if result.is_safe:
                if result.findings:
                    results['warnings'].append({
                        'file': str(file_path),
                        'findings': result.findings,
                    })
                else:
                    results['safe'].append(str(file_path))
            else:
                results['blocked'].append({
                    'file': str(file_path),
                    'reason': result.blocked_reason,
                    'findings': result.findings,
                })
    
    return results


if __name__ == "__main__":
    # Test scan
    import sys
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])
        result = scan_file(path)
        print(f"Safe: {result.is_safe}")
        if result.findings:
            for pid, sev, desc in result.findings:
                print(f"  [{sev}] {pid}: {desc}")
