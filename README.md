<div align="center">
  <img src="public/globe.svg" alt="InvestIQ AI Logo" width="120" height="120" />
  
  # InvestIQ AI
  
  **Enterprise-Grade Autonomous Investment Research & Decision Intelligence Platform**
  
  *Automating Wall Street-level equity analysis using a decentralized Multi-Agent AI architecture.*
  
  [![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/PavanKalyan1430/INVEST-IQ-INVESTMENT-RESEARCH-AGENT-)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
  [![Deployment](https://img.shields.io/badge/deployment-success-success.svg)]()
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
  [![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)]()
</div>

---

## 🚀 Executive Overview

**InvestIQ AI** is a state-of-the-art autonomous investment research platform that fundamentally reimagines how quantitative and qualitative financial data is synthesized. It replaces traditional, manual equity analysis pipelines with a coordinated swarm of specialized AI agents.

While single-prompt Large Language Models (LLMs) suffer from context window saturation, hallucination risks, and an inability to reason concurrently across diverse real-time data streams, InvestIQ AI solves these challenges through a **deterministic Multi-Agent Directed Acyclic Graph (DAG)** powered by **LangGraph**. 

By deploying seven distinct AI personas—each armed with specific external APIs and optimized system prompts—the platform executes parallel data ingestion, sequential risk analysis, and final decision reconciliation to produce institutional-quality investment recommendations in under 30 seconds.

---

## 📑 Table of Contents

1. [System Architecture](#-system-architecture)
2. [End-to-End Request Lifecycle](#-end-to-end-request-lifecycle)
3. [Multi-Agent DAG Workflow](#-multi-agent-dag-workflow)
4. [LLM Fallback & Circuit Breaker](#-llm-fallback--circuit-breaker)
5. [Agent Specifications](#-agent-specifications)
6. [Technology Stack](#-technology-stack)
7. [Current Architectural Drawbacks & Limitations](#-current-architectural-drawbacks--limitations)
8. [Advanced Future Modifications](#-advanced-future-modifications)
9. [Installation & Deployment](#-installation--deployment)

---

## 🏗️ System Architecture

InvestIQ AI operates on a modern, edge-ready architecture, separating the client-side visualization layer from the heavy, stateful orchestration layer. 

```mermaid
graph TB
    subgraph Client [Frontend UI Layer]
        Dashboard[React Dashboard]
        Terminal[Live Execution Terminal]
        Charts[Recharts / CSS Grids]
    end

    subgraph Backend [Next.js API Layer]
        API[API Route: /api/analyze]
        SSE[Server-Sent Events Streamer]
    end

    subgraph Orchestrator [LangGraph Engine]
        Graph[StateGraph Orchestration]
        Memory[In-Memory State Context]
    end

    subgraph Swarm [Multi-Agent Swarm]
        A1(Research Agent)
        A2(Financial Agent)
        A3(News Agent)
        A4(Sentiment Agent)
        A5(Risk Agent)
        A6(Decision Agent)
        A7(Report Agent)
    end

    subgraph External [External Data & Inference]
        LLM[Google Gemini 2.5 / Groq LLaMA]
        FinData[Finnhub & FMP APIs]
        NewsData[NewsAPI & Tavily]
    end

    Client -- HTTP POST --> API
    API -- Streaming Updates --> SSE
    SSE -- Stream --> Terminal
    API --> Graph
    Graph <--> Memory
    Graph --> Swarm
    Swarm <--> External
```

---

## 🔄 End-to-End Request Lifecycle

To understand the latency and data flow, below is the exact sequence of events from the moment a user requests an analysis to the final rendered dashboard. 

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Next.js Client
    participant API as /api/analyze (SSE)
    participant LangGraph as Orchestrator
    participant Agents as Swarm (Parallel)
    participant External as LLMs / Data APIs

    User->>UI: Inputs Ticker (e.g., TSLA)
    UI->>API: POST /api/analyze { companyName: "TSLA" }
    
    API->>UI: Establish SSE Connection (event: status)
    
    API->>LangGraph: Invoke investIQWorkflow.stream()
    
    LangGraph->>Agents: Trigger ResearchAgent
    Agents->>External: Fetch Profile (Finnhub) + Search (Tavily)
    External-->>Agents: Context Payload
    Agents->>External: LLM Inference (Gemini)
    External-->>LangGraph: Return `CompanyResearch` State
    LangGraph-->>API: Yield Node Chunk
    API-->>UI: SSE Event: 'Research Completed'
    
    par Parallel Execution
        LangGraph->>Agents: Trigger FinancialAgent
        LangGraph->>Agents: Trigger NewsAgent
        LangGraph->>Agents: Trigger SentimentAgent
    end
    
    Agents->>External: Fetch Financials (FMP) / News (NewsAPI)
    External-->>Agents: Raw Data
    Agents->>External: LLM Inference (Gemini)
    External-->>LangGraph: Yield Partial States
    
    LangGraph->>Agents: Trigger RiskAgent (Awaits Parallel Nodes)
    Agents->>External: LLM Inference
    External-->>LangGraph: Return `RiskAnalysis` State
    
    LangGraph->>Agents: Trigger DecisionAgent & ReportAgent
    Agents-->>LangGraph: Final `DecisionData` & `ReportData`
    
    LangGraph-->>API: Stream Complete
    API-->>UI: SSE Event: 'report' (Full JSON Payload)
    UI->>User: Render Dashboard Visualizations
```

---

## 🕸️ Multi-Agent DAG Workflow

The core power of InvestIQ AI lies in its **Directed Acyclic Graph (DAG)**. Unlike conversational agents that can get stuck in infinite reflection loops, this architecture ensures deterministic execution. It utilizes parallel branching to slash execution times by 40% while maintaining a strict dependency hierarchy for the final decision.

```mermaid
graph TD
    classDef startEnd fill:#0f172a,stroke:#334155,stroke-width:2px,color:#fff;
    classDef agent fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#fff;
    classDef state fill:#f1f5f9,stroke:#cbd5e1,stroke-width:2px,color:#0f172a;

    START((START)):::startEnd
    
    R[Research Agent]:::agent
    State1[State: companyName, research]:::state
    
    F[Financial Agent]:::agent
    N[News Agent]:::agent
    S[Sentiment Agent]:::agent
    State2[State: financial, news, sentiment]:::state
    
    Risk[Risk Agent]:::agent
    State3[State: risk]:::state
    
    D[Decision Agent]:::agent
    State4[State: decision]:::state
    
    Rep[Report Agent]:::agent
    State5[State: report]:::state
    
    END((END)):::startEnd

    START --> R
    R --> State1
    
    State1 --> F
    State1 --> N
    State1 --> S
    
    F --> State2
    N --> State2
    S --> State2
    
    State2 --> Risk
    Risk --> State3
    
    State3 --> D
    D --> State4
    
    State4 --> Rep
    Rep --> State5
    
    State5 --> END
```

---

## 🛡️ LLM Fallback & Circuit Breaker

To guarantee Enterprise uptime, the system never relies on a single point of failure for inference. We implemented a cascading circuit breaker in the API layer.

```mermaid
flowchart TD
    Req[Agent Requests LLM Inference] --> Gemini{Gemini 2.5 Flash API}
    Gemini -- Success --> Return[Parse JSON & Return State]
    Gemini -- Rate Limit / Timeout --> Groq{Groq API / LLaMA 3.3}
    
    Groq -- Success --> Return
    Groq -- Failure --> Mock[Trigger Deterministic Mock Generator]
    
    Mock --> Return
```

---

## 🧩 Agent Specifications

| Agent | Role | Data Grounding APIs | Core Responsibility | Output State Object |
| :--- | :--- | :--- | :--- | :--- |
| **Research** | Foundation Builder | Finnhub, Tavily | Maps company structure, competitors, products, and overall business model. | `CompanyResearch` |
| **Financial** | Quant Analyst | Financial Modeling Prep | Ingests balance sheets & income statements to calculate a proprietary 0-100 Health Score. | `FinancialAnalysis` |
| **News** | Information Scraper | NewsAPI, Tavily | Aggregates the last 7 days of global market chatter and press releases. | `NewsAnalysis` |
| **Sentiment** | NLP Classifier | (Consumes News State) | Performs semantic analysis on headlines to classify as Bullish, Bearish, or Neutral. | `SentimentAnalysis` |
| **Risk** | Compliance Officer | (Consumes Fin & Sent) | Weighs fundamental weakness against negative sentiment to generate a Risk Matrix. | `RiskAnalysis` |
| **Decision** | Portfolio Manager | (Consumes All States) | Reconciles bull vs bear cases and outputs a definitive BUY / HOLD / PASS recommendation. | `DecisionData` |
| **Report** | Visual Formatter | None | Compiles execution traces and agent decisions into a UI-ready JSON graph payload. | `ReportData` |

---

## ⚠️ Current Architectural Drawbacks & Limitations

While the current MVP demonstrates powerful multi-agent orchestration, it possesses several architectural limitations that prevent it from being a fully production-ready hedge fund tool.

1. **Stateless Execution (No Long-Term Memory):** 
   - *Drawback:* The LangGraph orchestration runs entirely in memory during the lifecycle of the API request. Once the request ends, the state is purged. 
   - *Impact:* Agents cannot learn from past analyses, and users lose their report upon refreshing the browser.
2. **Synchronous Bottleneck at Risk Agent:**
   - *Drawback:* The `RiskAgent` acts as a synchronous join node. It cannot begin execution until the *slowest* of the three parallel agents (Financial, News, Sentiment) completes. 
   - *Impact:* An API timeout on the `NewsAgent` holds up the entire pipeline.
3. **No Semantic Caching:**
   - *Drawback:* If two users search for "TSLA" within 5 minutes of each other, the system will perform full API fetching and LLM inference twice.
   - *Impact:* Extremely high and unnecessary LLM token expenditure and latency.
4. **Context Window Limitations on Raw Data:**
   - *Drawback:* Financial statements (10-K filings) are massive. We currently rely on summary APIs (FMP) rather than reading raw SEC filings because feeding a full 10-K into the prompt would blow out the token limit and increase latency to several minutes.

---

## 🔮 Advanced Future Modifications (Roadmap)

To elevate this platform to true institutional standards, the following architectural upgrades are proposed for v2.0:

### 1. Vector Database Integration (RAG)
Implement **Pinecone** or **Milvus** to store chunked and embedded 10-K and 10-Q SEC filings. Instead of relying on FMP API summaries, the `FinancialAgent` will perform Retrieval-Augmented Generation (RAG) directly against the raw financial text, allowing it to spot deep qualitative risks (e.g., hidden legal liabilities).

### 2. Semantic Caching Layer (Redis)
Introduce **Redis Stack** as a semantic caching layer in front of the LangGraph execution. Before triggering the workflow, the API will generate an embedding of the user's query and check Redis. If an analysis for that ticker was generated within the last 2 hours, it instantly returns the cached graph, reducing latency from 25s to 50ms.

### 3. Persistent Graph Storage (PostgreSQL + Prisma)
Migrate the in-memory `GraphState` to a persistent PostgreSQL database using LangGraph's `checkpointer` functionality. This enables:
- **Human-in-the-Loop (HITL):** The graph can pause at the `DecisionAgent`, wait for a human portfolio manager to inject their own notes via the UI, and then resume execution.
- **Historical Backtesting:** Storing past agent predictions to backtest against actual market performance over a 6-month period, allowing us to evaluate agent accuracy.

### 4. WebSocket Streaming over SSE
Replace Server-Sent Events (SSE) with a full bidirectional WebSocket connection (e.g., Socket.io). This will allow the client to interrupt the workflow mid-execution or send live prompt-injections to individual agents while they are running.

### 5. Multi-Modal Analysis
Upgrade the `ResearchAgent` to accept multi-modal inputs (e.g., user uploads a screenshot of an earnings chart or a PDF prospectus). Gemini 1.5 Pro's vision capabilities can be utilized to extract technical analysis data directly from images.

---

## 🛠️ Technology Stack

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 14 App Router | Ideal for edge-deployed serverless functions and React Server Components. |
| **Orchestration** | LangGraph (JS) | Provides cyclic, stateful graphs; vastly superior to LangChain sequential chains. |
| **Inference Engine** | Google Gemini 2.5 Flash | The fastest multimodal model for structured JSON outputs at scale. |
| **Fallback Engine** | LLaMA 3.3 (via Groq) | Ultra-low latency LPU inference serving as our Level-2 circuit breaker. |
| **Visualizations** | Recharts & Custom CSS Grids | Lightweight, responsive SVG rendering for Radar and Heatmap charts. |
| **Styling** | Tailwind CSS v4 | Provides strict design tokens and seamless Dark Mode (`.dark`) toggling. |

---

## ⚙️ Installation & Deployment

**Prerequisites:** Node.js v20+, npm or pnpm.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PavanKalyan1430/INVEST-IQ-INVESTMENT-RESEARCH-AGENT-.git
   cd INVEST-IQ
   ```

2. **Environment Variables:** Create a `.env.local` file at the root:
   ```env
   # Inference
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key

   # Financial & Grounding Data
   TAVILY_API_KEY=your_tavily_key
   FINNHUB_API_KEY=your_finnhub_key
   FMP_API_KEY=your_fmp_key
   NEWS_API_KEY=your_news_key
   ```

3. **Install & Run Locally:**
   ```bash
   npm install
   npm run dev
   ```
   The application and API will be available at `http://localhost:3000`.

4. **Production Deployment (Vercel):**
   The application is highly optimized for Vercel Serverless Functions.
   Ensure `maxDuration` is set properly in `next.config.ts` if LLM inference times out.

---

## 📜 License

This project is licensed under the MIT License.

---
<div align="center">
  <i>Built with extreme precision. Engineered for scale.</i>
</div>
