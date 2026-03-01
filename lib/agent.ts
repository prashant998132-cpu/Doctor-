// lib/agent.ts — JARVIS Agentic System
// ReAct Pattern: Reasoning + Acting + Observing

export type AgentAction = 
  | { type: 'think'; content: string }
  | { type: 'tool'; name: string; args: Record<string, any> }
  | { type: 'observe'; result: any }
  | { type: 'reflect'; insight: string }
  | { type: 'respond'; message: string }

export interface AgentStep {
  action: AgentAction
  timestamp: number
  success: boolean
}

export interface AgentTask {
  id: string
  goal: string
  context: string
  steps: AgentStep[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  output?: string
  createdAt: number
}

export interface Tool {
  name: string
  description: string
  enabled: boolean
  execute: (args: Record<string, any>) => Promise<any>
  category: 'search' | 'api' | 'memory' | 'action' | 'analysis'
}

// ━━━ TOOL REGISTRY ━━━
export const toolRegistry: Record<string, Tool> = {
  web_search: {
    name: 'web_search',
    description: 'Search web using DuckDuckGo (free)',
    enabled: true,
    category: 'search',
    execute: async (args: Record<string, any>) => {
      // Implementation in ChatInterface
      return { status: 'ok' }
    },
  },
  get_weather: {
    name: 'get_weather',
    description: 'Get weather from Open-Meteo (free)',
    enabled: true,
    category: 'api',
    execute: async (args: Record<string, any>) => {
      return { status: 'ok' }
    },
  },
  memory_recall: {
    name: 'memory_recall',
    description: 'Recall from custom instructions or memory',
    enabled: true,
    category: 'memory',
    execute: async (args: Record<string, any>) => {
      return { status: 'ok' }
    },
  },
  image_analysis: {
    name: 'image_analysis',
    description: 'Analyze image using Gemini Vision (free quota)',
    enabled: true,
    category: 'analysis',
    execute: async (args: Record<string, any>) => {
      return { status: 'ok' }
    },
  },
}

// ━━━ REACT AGENT LOOP ━━━
export async function runAgentTask(task: AgentTask): Promise<AgentTask> {
  task.status = 'running'
  const steps: AgentStep[] = []

  try {
    // STEP 1: THINK - Understand goal
    const thinkStep: AgentStep = {
      action: { type: 'think', content: `Understanding goal: ${task.goal}` },
      timestamp: Date.now(),
      success: true,
    }
    steps.push(thinkStep)

    // STEP 2: PLAN - What tools to use?
    const toolsNeeded = selectTools(task.goal, task.context)
    const planStep: AgentStep = {
      action: { type: 'think', content: `Selected tools: ${toolsNeeded.map(t => t.name).join(', ')}` },
      timestamp: Date.now(),
      success: true,
    }
    steps.push(planStep)

    // STEP 3: ACT - Execute tools
    let actionResults: Record<string, any> = {}
    for (const tool of toolsNeeded) {
      const args = extractArgs(task.goal, tool.name)
      const toolStep: AgentStep = {
        action: { type: 'tool', name: tool.name, args },
        timestamp: Date.now(),
        success: false,
      }

      try {
        const result = await tool.execute(args)
        actionResults[tool.name] = result
        toolStep.success = true
      } catch (error) {
        toolStep.success = false
        actionResults[tool.name] = { error: String(error) }
      }
      steps.push(toolStep)
    }

    // STEP 4: OBSERVE - Check results
    const observeStep: AgentStep = {
      action: { type: 'observe', result: actionResults },
      timestamp: Date.now(),
      success: true,
    }
    steps.push(observeStep)

    // STEP 5: REFLECT - Any improvements needed?
    const reflectStep: AgentStep = {
      action: { type: 'reflect', insight: `Processed goal using ${toolsNeeded.length} tools` },
      timestamp: Date.now(),
      success: true,
    }
    steps.push(reflectStep)

    // STEP 6: RESPOND - Final output
    const output = formatAgentOutput(task.goal, actionResults)
    const respondStep: AgentStep = {
      action: { type: 'respond', message: output },
      timestamp: Date.now(),
      success: true,
    }
    steps.push(respondStep)

    task.steps = steps
    task.status = 'completed'
    task.output = output
  } catch (error) {
    task.status = 'failed'
    task.steps = steps
  }

  return task
}

// ━━━ TOOL SELECTION INTELLIGENCE ━━━
function selectTools(goal: string, context: string): Tool[] {
  const tools: Tool[] = []
  const lowerGoal = `${goal} ${context}`.toLowerCase()

  // Smart tool selection based on goal
  if (/search|find|what|how|tell me|research|know/.test(lowerGoal)) {
    tools.push(toolRegistry.web_search)
  }
  if (/weather|temperature|climate|rain|sunny/.test(lowerGoal)) {
    tools.push(toolRegistry.get_weather)
  }
  if (/remember|recall|instruction|prefer|like|goal/.test(lowerGoal)) {
    tools.push(toolRegistry.memory_recall)
  }
  if (/image|photo|picture|analyze|describe|see/.test(lowerGoal)) {
    tools.push(toolRegistry.image_analysis)
  }

  // If no tools selected, add thinking
  if (tools.length === 0) {
    tools.push(toolRegistry.memory_recall)
  }

  return tools
}

// ━━━ ARGUMENT EXTRACTION ━━━
function extractArgs(goal: string, toolName: string): Record<string, any> {
  switch (toolName) {
    case 'web_search':
      return { query: extractQuery(goal) }
    case 'get_weather':
      return { location: extractLocation(goal) || 'Delhi' }
    case 'memory_recall':
      return { query: goal }
    case 'image_analysis':
      return { imageUrl: '', prompt: goal }
    default:
      return {}
  }
}

function extractQuery(text: string): string {
  return text.replace(/search|find|what|how|tell me|research/gi, '').trim()
}

function extractLocation(text: string): string | null {
  const locationMatch = text.match(/in\s+([A-Za-z\s]+)|Delhi|Mumbai|Bangalore|location:\s*([A-Za-z\s]+)/i)
  return locationMatch ? (locationMatch[1] || locationMatch[2] || null) : null
}

// ━━━ OUTPUT FORMATTING ━━━
function formatAgentOutput(goal: string, results: Record<string, any>): string {
  let output = ''

  for (const [toolName, result] of Object.entries(results)) {
    if (result.error) {
      output += `❌ ${toolName}: Failed\n`
    } else {
      output += `✅ ${toolName}: ${JSON.stringify(result).slice(0, 100)}...\n`
    }
  }

  return output || 'Task completed'
}

// ━━━ AUTO-IMPROVEMENT SYSTEM ━━━
export interface AgentLearning {
  goalPattern: string
  bestTools: string[]
  successRate: number
  lastUsed: number
}

const learningMemory: Map<string, AgentLearning> = new Map()

export function recordLearning(goal: string, usedTools: string[], success: boolean): void {
  const pattern = goal.slice(0, 20).toLowerCase()
  const existing = learningMemory.get(pattern)

  const learning: AgentLearning = {
    goalPattern: pattern,
    bestTools: usedTools,
    successRate: existing ? (existing.successRate + (success ? 1 : 0)) / 2 : (success ? 1 : 0),
    lastUsed: Date.now(),
  }

  learningMemory.set(pattern, learning)
}

export function improveSuggestions(goal: string): string[] {
  const suggestions: string[] = []
  const pattern = goal.slice(0, 20).toLowerCase()
  const learning = learningMemory.get(pattern)

  if (learning && learning.successRate > 0.8) {
    suggestions.push(`💡 Pattern found: Use ${learning.bestTools.join(', ')} for similar tasks`)
  }

  return suggestions
}
