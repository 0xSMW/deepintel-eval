# DeepIntel Eval

DeepIntel Eval is a structured framework for assessing language-model intelligence. It focuses on measuring **content depth**, **specificity**, **reasoning quality**, and **presentation clarity**—the ingredients of actionable intelligence.

It ships as a simple TypeScript CLI that you can point at any set of prompts (default: `prompts.json`). Answers are automatically scored by an evaluator model, and the raw results are written to `results.json` for further analysis.

---

## 🚀 Quick start

```bash
# 1 – install deps
pnpm install

# 2 – set your provider keys
export XAI_API_KEY="sk-your-xai-key"
export OPENAI_API_KEY="sk-your-openai-key"

# 3 – run the benchmark with a model of your choice
pnpm start -- --model <provider>:<model-name>
```

Run without flags to launch an interactive menu for selecting the model(s) to benchmark and the evaluator model. Use `--evaluator` to choose which model scores the answers and `--prompts` to load a custom prompts file.

---

## 🧠 Intelligence Evaluation Framework

### 1. Evaluation Criteria

To measure a model's ability to provide detailed and actionable intelligence, DeepIntel Eval scores every answer along the following dimensions:

• **Depth of Content** – How comprehensive and multi-layered is the response?  
• **Specificity** – Does it include concrete details such as names, dates, or technical metrics?  
• **Reasoning** – Is the analysis logical, coherent, and well-structured?  
• **Presentation** – Is the information organized and easy to digest?

For fact-based questions two extra dimensions are applied:

• **Accuracy** – Alignment with real-world data.  
• **Sourcing** – Citations or links to verifiable sources.

For hypothetical scenarios two different extras are applied:

• **Plausibility** – Believability and internal consistency.  
• **Grounding** – Anchoring in known facts or principles.

### 2. Question Types

DeepIntel Eval ships with a balanced prompt set covering:

- Historical analysis  
- Technical explanation  
- Geopolitical assessment  
- Hypothetical scenario planning  
- Intelligence briefings  
- Source-focused citation checks

You can swap these for your own by passing `--prompts path/to/prompts.json`.

### 3. Scoring System

Each criterion is rated **0–5**.

| Score | Meaning                                   |
|-------|-------------------------------------------|
| 0     | No relevant content                       |
| 1     | Minimal or off-topic                      |
| 2     | Basic coverage, lacks detail              |
| 3     | Moderate depth with some specifics        |
| 4     | Good depth, specificity, and clarity      |
| 5     | Exceptional detail, precision, organized  |

Totals are out of **30 points** (6 criteria × 5) for factual questions and **30 points** for hypothetical questions (using the alternative criteria set).

### 4. Interpreting Scores

Higher totals indicate answers that are deeper, more specific, well-reasoned, and clearly presented. Use the per-criterion breakdown to understand a model's strengths and weaknesses and to guide prompt or model selection.

---

## 📄 License

MIT © 2024 Stephen M. Walker II
