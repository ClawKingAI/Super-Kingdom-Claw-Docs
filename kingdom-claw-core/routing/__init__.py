"""
Prompt Routing - Match Prompts to Commands/Tools

Implements routing patterns from Claw Code:
- Tokenize prompts for matching
- Score by relevance
- Support disambiguation
- Log routing decisions
"""

from dataclasses import dataclass
from typing import Optional
from enum import Enum


class MatchKind(Enum):
    """Type of match"""
    COMMAND = "command"
    TOOL = "tool"


@dataclass(frozen=True)
class RoutedMatch:
    """A matched command or tool"""
    kind: MatchKind
    name: str
    source_hint: str
    score: int
    matched_tokens: tuple[str, ...] = ()
    
    def is_command(self) -> bool:
        return self.kind == MatchKind.COMMAND
    
    def is_tool(self) -> bool:
        return self.kind == MatchKind.TOOL


class PromptRouter:
    """
    Route prompts to matching commands and tools.
    
    Tokenizes the prompt and scores matches based on
    token overlap with command/tool names and descriptions.
    """
    
    # Words to ignore when tokenizing
    STOP_WORDS = {
        "a", "an", "the", "is", "are", "was", "were", "be", "been",
        "being", "have", "has", "had", "do", "does", "did", "will",
        "would", "could", "should", "may", "might", "must", "shall",
        "can", "need", "dare", "ought", "used", "to", "of", "in",
        "for", "on", "with", "at", "by", "from", "as", "into",
        "through", "during", "before", "after", "above", "below",
        "between", "under", "again", "further", "then", "once",
        "here", "there", "when", "where", "why", "how", "all",
        "each", "few", "more", "most", "other", "some", "such",
        "no", "nor", "not", "only", "own", "same", "so", "than",
        "too", "very", "just", "and", "but", "if", "or", "because",
        "until", "while", "about", "against", "i", "me", "my",
        "you", "your", "he", "she", "it", "its", "we", "they",
        "them", "their", "what", "which", "who", "whom", "this",
        "that", "these", "those", "please", "want", "like",
    }
    
    def __init__(self, registry: 'ExecutionRegistry'):
        self.registry = registry
        
    def tokenize(self, prompt: str) -> set[str]:
        """
        Tokenize a prompt into searchable tokens.
        
        Removes stop words and normalizes case.
        """
        # Split on common delimiters
        raw_tokens = prompt.replace("/", " ").replace("-", " ").replace("_", " ")
        raw_tokens = raw_tokens.replace(".", " ").replace(",", " ")
        raw_tokens = raw_tokens.lower().split()
        
        # Remove stop words and short tokens
        return {
            t for t in raw_tokens
            if t not in self.STOP_WORDS and len(t) > 1
        }
    
    def route(self, prompt: str, limit: int = 5) -> list[RoutedMatch]:
        """
        Route a prompt to matching commands and tools.
        
        Returns top N matches sorted by score.
        """
        tokens = self.tokenize(prompt)
        
        # Collect matches from commands and tools
        command_matches = self._match_commands(tokens)
        tool_matches = self._match_tools(tokens)
        
        # Combine and sort by score (descending)
        all_matches = command_matches + tool_matches
        all_matches.sort(key=lambda m: (-m.score, m.kind.value, m.name))
        
        return all_matches[:limit]
    
    def _match_commands(self, tokens: set[str]) -> list[RoutedMatch]:
        """Match tokens against commands"""
        matches = []
        
        for entry in self.registry.commands.all():
            score, matched = self._score(tokens, entry.name, entry.description)
            if score > 0:
                matches.append(RoutedMatch(
                    kind=MatchKind.COMMAND,
                    name=entry.name,
                    source_hint=entry.source_hint,
                    score=score,
                    matched_tokens=tuple(matched)
                ))
                
        return matches
    
    def _match_tools(self, tokens: set[str]) -> list[RoutedMatch]:
        """Match tokens against tools"""
        matches = []
        
        for entry in self.registry.tools.all():
            score, matched = self._score(tokens, entry.name, entry.description)
            if score > 0:
                matches.append(RoutedMatch(
                    kind=MatchKind.TOOL,
                    name=entry.name,
                    source_hint=entry.source_hint,
                    score=score,
                    matched_tokens=tuple(matched)
                ))
                
        return matches
    
    def _score(
        self,
        tokens: set[str],
        name: str,
        description: str
    ) -> tuple[int, list[str]]:
        """
        Score a potential match.
        
        Returns (score, matched_tokens).
        Higher score = better match.
        """
        # Tokenize the name and description
        name_tokens = set(name.lower().replace("_", " ").split())
        desc_tokens = self.tokenize(description or "")
        
        # Combine all searchable tokens
        searchable = name_tokens | desc_tokens
        
        # Find matching tokens
        matched = tokens & searchable
        
        # Score based on:
        # - Number of matched tokens
        # - Bonus for name match (more specific)
        # - Bonus for exact prefix match
        
        score = len(matched) * 10
        
        # Bonus for name match
        name_matched = tokens & name_tokens
        if name_matched:
            score += len(name_matched) * 5
            
        # Bonus for exact prefix match
        name_lower = name.lower()
        for token in tokens:
            if name_lower.startswith(token):
                score += 15
                
        return score, list(matched)
    
    def route_with_context(
        self,
        prompt: str,
        context: dict,
        limit: int = 5
    ) -> list[RoutedMatch]:
        """
        Route with additional context.
        
        Context can provide hints about what kind of
        operation is expected.
        """
        matches = self.route(prompt, limit * 2)  # Get more candidates
        
        # Apply context-based filtering/boosting
        if context.get("prefer_commands"):
            matches.sort(key=lambda m: (
                0 if m.is_command() else 1,
                -m.score
            ))
        elif context.get("prefer_tools"):
            matches.sort(key=lambda m: (
                0 if m.is_tool() else 1,
                -m.score
            ))
            
        return matches[:limit]
    
    def disambiguate(
        self,
        prompt: str,
        matches: list[RoutedMatch]
    ) -> Optional[RoutedMatch]:
        """
        Attempt to disambiguate between matches.
        
        If one match is clearly better, return it.
        Otherwise return None (need user input).
        """
        if not matches:
            return None
        if len(matches) == 1:
            return matches[0]
            
        # Check for clear winner (score 2x higher than next)
        if matches[0].score >= matches[1].score * 2:
            return matches[0]
            
        # No clear winner
        return None


def route_prompt(
    prompt: str,
    registry: 'ExecutionRegistry',
    limit: int = 5
) -> list[RoutedMatch]:
    """Convenience function for routing"""
    router = PromptRouter(registry)
    return router.route(prompt, limit)
