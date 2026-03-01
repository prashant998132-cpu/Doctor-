// lib/multiAgent.ts — Multi-Agent System (3 Specialized Agents)

import { semanticMemory } from './semanticMemory'

export type AgentType = 'researcher' | 'coder' | 'scheduler'

export interface AgentTask {
  type: AgentType
  goal: string
  context: string
  priority: 'low' | 'medium' | 'high'
}

export interface AgentResult {
  agent: AgentType
  success: boolean
  result: string
  confidence: number // 0-1
  executionTime: number
}

// ━━━ AGENT BASE CLASS ━━━
abstract class BaseAgent {
  abstract name: AgentType
  abstract specialties: string[]
  abstract execute(goal: string, context: string): Promise<string>

  async canHandle(task: string): Promise<boolean> {
    const keywords = task.toLowerCase()
    return this.specialties.some(s => keywords.includes(s))
  }
}

// ━━━ RESEARCH AGENT ━━━
// Handles: research, analysis, information gathering, news
class ResearchAgent extends BaseAgent {
  name: AgentType = 'researcher'
  specialties = ['research', 'analyze', 'find', 'search', 'explain', 'what is', 'how to']

  async execute(goal: string, context: string): Promise<string> {
    try {
      // Semantic search from memory
      const results = semanticMemory.semanticSearch(goal, 3)
      
      if (results.length > 0) {
        const relatedInfo = results
          .map(r => `Found: ${r.context}`)
          .join('\n')
        return `Based on similar past queries:\n${relatedInfo}\n\nFor latest info, search online.`
      }

      return `Research topic: ${goal}\nWould search for latest information and compile findings.`
    } catch (error) {
      return `Research failed: ${error}`
    }
  }
}

// ━━━ CODE AGENT ━━━
// Handles: coding, debugging, code review, implementation
class CodeAgent extends BaseAgent {
  name: AgentType = 'coder'
  specialties = ['code', 'debug', 'fix', 'write', 'implement', 'function', 'error', 'syntax']

  async execute(goal: string, context: string): Promise<string> {
    try {
      // Find similar code problems
      const codeProblems = semanticMemory.findSimilarQuestions(goal, 3)
      
      let response = `Code Task: ${goal}\n`

      if (codeProblems.length > 0) {
        response += `\nSimilar problems solved before:\n`
        codeProblems.forEach(p => {
          response += `- ${p.context.substring(0, 100)}...\n`
        })
      }

      response += `\nWould analyze, debug, or implement as needed.`
      return response
    } catch (error) {
      return `Code analysis failed: ${error}`
    }
  }
}

// ━━━ SCHEDULER AGENT ━━━
// Handles: scheduling, reminders, planning, organization
class SchedulerAgent extends BaseAgent {
  name: AgentType = 'scheduler'
  specialties = ['schedule', 'remind', 'time', 'when', 'tomorrow', 'next week', 'calendar', 'organize']

  async execute(goal: string, context: string): Promise<string> {
    try {
      // Extract time information
      const timePattern = /\b(tomorrow|today|next week|at \d+:\d+|in \d+ hours?|minutes?)\b/gi
      const times = goal.match(timePattern) || []

      let response = `Scheduling Task: ${goal}\n`

      if (times.length > 0) {
        response += `Detected times: ${times.join(', ')}\n`
      }

      response += `Would set reminder and track progress.`
      return response
    } catch (error) {
      return `Scheduling failed: ${error}`
    }
  }
}

// ━━━ AGENT ROUTER ━━━
export class AgentRouter {
  private agents: BaseAgent[] = [
    new ResearchAgent(),
    new CodeAgent(),
    new SchedulerAgent(),
  ]

  async routeTask(task: AgentTask): Promise<AgentResult> {
    const startTime = performance.now()

    try {
      // Find best matching agent
      let bestAgent: BaseAgent | null = null
      let bestScore = 0

      for (const agent of this.agents) {
        if (await agent.canHandle(task.goal)) {
          bestScore = 1
          bestAgent = agent
          break
        }
      }

      // Fallback to first agent if no match
      if (!bestAgent) {
        bestAgent = this.agents[0]
        bestScore = 0.5
      }

      // Execute task
      const result = await bestAgent.execute(task.goal, task.context)
      const executionTime = performance.now() - startTime

      // Record in semantic memory
      semanticMemory.addEntry(
        `Agent ${bestAgent.name}: ${task.goal} -> ${result}`,
        'agent-log',
        'message'
      )

      return {
        agent: bestAgent.name,
        success: true,
        result,
        confidence: bestScore,
        executionTime,
      }
    } catch (error) {
      const executionTime = performance.now() - startTime
      return {
        agent: task.type,
        success: false,
        result: `Error: ${error}`,
        confidence: 0,
        executionTime,
      }
    }
  }

  // Get available agents
  getAgents(): AgentType[] {
    return this.agents.map(a => a.name)
  }
}

// ━━━ EXPORT SINGLETON ━━━
export const agentRouter = new AgentRouter()
