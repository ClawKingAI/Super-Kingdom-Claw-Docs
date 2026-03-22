#!/usr/bin/env python3
"""
Kingdom Claw NemoClaw Integration
Using NVIDIA's official NemoClaw SDK for agent orchestration
"""

import os
from typing import Optional, List, Dict, Any

# Try to import NemoClaw, fall back to direct API if not available
try:
    from nemoclaw import NemoAgent
    NEMOCLAW_AVAILABLE = True
except ImportError:
    NEMOCLAW_AVAILABLE = False
    from openai import OpenAI

class KingdomClawAgent:
    """
    Kingdom Claw agent using NVIDIA NemoClaw SDK
    Falls back to direct OpenAI-compatible API if NemoClaw not available
    """

    def __init__(
        self,
        name: str,
        role: str,
        api_key: Optional[str] = None,
        model: str = "z-ai/glm5"
    ):
        self.name = name
        self.role = role
        self.model = model
        self.api_key = api_key or os.getenv("NVIDIA_API_KEY")

        if NEMOCLAW_AVAILABLE:
            self._init_nemoclaw()
        else:
            self._init_openai_compat()

    def _init_nemoclaw(self):
        """Initialize using NemoClaw SDK"""
        self.client = NemoAgent(
            model=self.model,
            api_key=self.api_key,
            base_url="https://integrate.api.nvidia.com/v1"
        )

    def _init_openai_compat(self):
        """Initialize using OpenAI-compatible API (fallback)"""
        self.client = OpenAI(
            api_key=self.api_key,
            base_url="https://integrate.api.nvidia.com/v1"
        )

    def process(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Process a prompt and return response"""
        system_prompt = f"You are {self.name}, {self.role}"

        messages = [
            {"role": "system", "content": system_prompt},
        ]

        if context:
            messages.append({
                "role": "system",
                "content": f"Context: {context}"
            })

        messages.append({"role": "user", "content": prompt})

        if NEMOCLAW_AVAILABLE:
            return self._process_nemoclaw(messages)
        else:
            return self._process_openai(messages)

    def _process_nemoclaw(self, messages: List[Dict]) -> str:
        """Process using NemoClaw"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=2048
        )
        return response.choices[0].message.content

    def _process_openai(self, messages: List[Dict]) -> str:
        """Process using OpenAI-compatible API"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=2048
        )
        return response.choices[0].message.content


class KingdomClawOrchestrator:
    """
    Orchestrates multiple Kingdom Claw agents
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("NVIDIA_API_KEY")
        self.agents: Dict[str, KingdomClawAgent] = {}

    def register_agent(self, name: str, role: str, model: str = "z-ai/glm5"):
        """Register a new agent"""
        self.agents[name] = KingdomClawAgent(
            name=name,
            role=role,
            api_key=self.api_key,
            model=model
        )

    def dispatch(self, agent_name: str, prompt: str, context: Optional[Dict] = None) -> str:
        """Dispatch a task to a specific agent"""
        if agent_name not in self.agents:
            raise ValueError(f"Agent '{agent_name}' not registered")

        return self.agents[agent_name].process(prompt, context)

    def list_agents(self) -> List[str]:
        """List all registered agents"""
        return list(self.agents.keys())


# Predefined agent roles for Kingdom Claw system
DEFAULT_AGENTS = {
    "orchestrator": "the central coordinator managing project intake, planning, and delivery",
    "developer": "the code builder responsible for building, testing, and deploying applications",
    "designer": "the creative agent responsible for UI/UX, styling, and brand consistency",
    "outreach": "the email agent responsible for composing and sending email campaigns",
    "leads": "the prospector responsible for finding and verifying contact information",
    "researcher": "the intel agent responsible for gathering information and documentation",
    "analyst": "the metrics agent responsible for tracking and reporting",
    "deployer": "the ship agent responsible for building and deploying to production",
}


def create_kingdom_claw_orchestrator(api_key: Optional[str] = None) -> KingdomClawOrchestrator:
    """
    Create a Kingdom Claw orchestrator with all default agents
    """
    orchestrator = KingdomClawOrchestrator(api_key=api_key)

    for name, role in DEFAULT_AGENTS.items():
        orchestrator.register_agent(name, role)

    return orchestrator


if __name__ == "__main__":
    # Test the integration
    print("=== Kingdom Claw NemoClaw Integration ===")
    print(f"NemoClaw Available: {NEMOCLAW_AVAILABLE}")
    print()

    # Create orchestrator
    orchestrator = create_kingdom_claw_orchestrator()
    print(f"Registered agents: {orchestrator.list_agents()}")
    print()

    # Test dispatch
    print("Testing developer agent...")
    response = orchestrator.dispatch(
        "developer",
        "What tech stack would you recommend for a case management portal?"
    )
    print(f"Response: {response[:200]}...")
