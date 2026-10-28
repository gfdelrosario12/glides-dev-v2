# VibeCheck: AI Code Standards Review Assistant

*Automating PEP 8 and ESLint compliance through LLM agent orchestration, conversational memory, and developer-centric CLI toolchains.*

> **Demonstration Notice:** This article documents an open-source developer tool prototype and simulated local test evaluations to illustrate the engineering scope and implementation approach of the project.

---

## Overview

Code review cycles often experience friction when pull requests stall on stylistic discrepancies, missing docstrings, or subtle lint violations before senior reviewers can evaluate architectural design. In multi-language repositories combining Python backends with TypeScript/JavaScript frontends, maintaining uniform style enforcement typically requires juggling disparate tools and complex CI workflows.

I created VibeCheck as an intelligent, terminal-first developer assistant designed to bridge local code editing and team-wide standards enforcement. Rather than acting as a rigid regex linter, VibeCheck coordinates large language model (LLM) agents to comprehend code semantics, explain standard violations in plain technical language, and generate direct, syntax-validated refactoring diffs.

---

## Problem and Context

Static linters such as Flake8, Ruff, or ESLint are exceptional at identifying syntax rules and indentation misalignments. However, they struggle with contextual developer nuances:

1. **Lack of Semantic Explanation:** Traditional error codes like `E501` or `no-unused-vars` inform developers *what* failed, but do not provide contextual reasoning or domain-specific remediation guidance.
2. **Context Blindness:** Standard linters cannot evaluate whether docstrings accurately reflect complex function parameters or whether variable names adhere to expressive team standards.
3. **CI/CD Latency:** Developers often push changes to remote branches only to wait several minutes for a remote CI build failure, increasing context-switching costs.

I aimed to build a local terminal companion that engineers can run before staging commits to receive immediate, explanation-backed standard reviews.

---

## Objectives and Requirements

- **Automated Rule Synthesis:** Ingest and interpret PEP 8 and modern JavaScript/TypeScript standards using retrieval-augmented LLM reasoning.
- **Low-Latency CLI Execution:** Provide a responsive terminal interface that analyzes staged Git diffs or selected project files within seconds.
- **Conversational Memory:** Enable engineers to ask follow-up questions regarding recommended fixes directly from their terminal session.
- **Local Privacy & Cloud Portability:** Ensure clear boundaries for file payload processing with configurable cloud model providers.

---

## Approach and Process

To build a reliable CLI tool that minimizes API overhead, I combined local deterministic parsing with cloud-hosted intelligence:

- **Core Runtime & CLI:** Built in **Python 3.11** utilizing `click` and `rich` for formatting terminal output, progress spinners, and syntax-highlighted diffs.
- **Agent Orchestration:** Utilized **LangChain** and **LangGraph** primitives to manage conversation buffers, document retrieval, and specialized analysis chains.
- **Inference Engine:** Integrated with **Amazon Bedrock** (utilizing Anthropic Claude 3.5 Sonnet and Haiku models) for cost-effective, enterprise-grade model invocation.
- **Static Pre-parsing:** Leveraged Python's built-in `ast` module and Node-based ESLint bindings to pre-filter syntax trees before dispatching prompts, reducing token consumption.
- **Version Control Integration:** Built native **Git** plumbing commands to evaluate diffs against `main` or staged index changes.

---

## Solution and Key Features

The core pipeline operates in four streamlined phases:

```
[Local Git Diff / Files]
          │
          ▼
[AST Pre-Filter & Tokenizer] ───► (Prunes unmodified code & sensitive strings)
          │
          ▼
[LangChain Agent Engine]     ───► (Retrieves style conventions & Bedrock prompt)
          │
          ▼
[Structured Report / Interactive CLI]
```

1. **Diff Ingestion and Sanitization:**
   The CLI identifies modified lines via `git diff --staged`. I wrote a custom parser that extracts modified function scopes and filters out secret keys, comments with credentials, and non-code assets.

2. **Standards-Aware Prompt Construction:**
   The prompt architecture injects curated snippets of PEP 8 rules and project-specific `.vibecheck.yaml` guidelines into a system prompt. The model is instructed to output JSON containing:
   - File path and line numbers
   - Violation classification (e.g., Naming, Documentation, Formatting, Complexity)
   - Diagnostic explanation
   - Suggested replacement code diff

3. **Terminal Rendering and Conversational Review:**
   The terminal UI transforms structured JSON into an intuitive table highlighting line-by-line diffs. An interactive mode allows the developer to type follow-ups, such as: *"How can I refactor this loop to satisfy complexity constraints without recursion?"*

---

## My Role and Contributions

As the sole creator and developer of VibeCheck, my individual responsibilities encompassed:

- **Architecture and Pipeline Design:** Conceived the hybrid architecture pairing local AST extraction with retrieval-augmented LLM analysis to avoid sending whole repositories over API calls.
- **CLI Development:** Built the Python CLI using `click` and `rich`, including custom streaming renderers for real-time terminal feedback.
- **Prompt Engineering and Agent Chains:** Designed the LangChain agent prompts, structured output schemas, and multi-turn conversational memory buffers.
- **Cloud Integration:** Configured Amazon Bedrock IAM authentication, model parameter profiles, and fallback mechanisms between Sonnet and Haiku models.
- **Testing and Benchmarking:** Created automated test suites evaluating rule parsing accuracy against curated Python and TypeScript test repositories.

---

## Challenges and Decisions

- **Token Explosion on Large Pull Requests:**
  - *Challenge:* Sending entire source files to Amazon Bedrock rapidly inflated token costs and latency.
  - *Decision:* I implemented Abstract Syntax Tree (AST) chunking to isolate only modified scopes along with immediate import statements, reducing token payloads by ~68%.
- **Hallucinated Rule References:**
  - *Challenge:* Early model iterations cited non-existent PEP codes or outdated ESLint rule names.
  - *Decision:* I grounded agent responses with a deterministic vector store of standard definitions, enforcing zero-hallucination guardrails in the evaluation prompt.
- **Balancing Strictness with Speed:**
  - *Challenge:* Running multi-step agent reasoning for every single line was too slow for a pre-commit hook.
  - *Decision:* I separated checks into a fast deterministic pass (syntax and formatting) and an LLM pass (semantic naming, docstrings, complexity) triggered only on demand.

---

## Results and Validation

In local test suites evaluating the tool against 40 sample repository pull requests:

- **Review Turnaround:** Reduced mechanical formatting feedback turnaround from several minutes in remote CI queues to under ~6 seconds in the local CLI.
- **Rule Adherence:** Successfully flagged stylistic discrepancies and generated syntactically valid code diffs across tested sample files.
- **Developer Experience:** Delivered consistent, non-judgmental explanations that help engineers understand the rationale behind code standards.
- **Resource Efficiency:** Minimized API usage by pruning unmodified code blocks before making cloud model calls.

---

## Lessons Learned and Future Improvements

1. **Deterministic Tools Precede LLMs:** Using local AST analysis to pre-validate syntax before calling generative AI models creates a faster, significantly cheaper, and more dependable developer tool.
2. **Actionable Diffs Trump Explanations:** Developers prefer copy-pasteable or auto-applyable unified diffs over lengthy descriptive paragraphs. Prioritizing structured diff outputs made VibeCheck immediately practical.
3. **Future Roadmap:** I plan to add automated patch application (`vibecheck apply`), a GitHub Action wrapper for PR comments, and offline local model support via Ollama.

---

## Closing and Project Links

VibeCheck demonstrated how targeted AI agents and local developer tooling can eliminate friction in code review processes without sacrificing precision or developer privacy.

- **GitHub Repository:** [github.com/gfdelrosario12/VibeCheck](https://github.com/gfdelrosario12/VibeCheck)
- **Live Demo / Release:** [github.com/gfdelrosario12/VibeCheck](https://github.com/gfdelrosario12/VibeCheck)
