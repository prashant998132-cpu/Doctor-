// lib/plugins.ts — Extensible Feature System
// Add new features without touching core code

export interface PluginMetadata {
  id: string
  name: string
  version: string
  author: string
  description: string
  category: 'tool' | 'integration' | 'ui' | 'action' | 'analysis'
  enabled: boolean
  dependencies?: string[]
}

export interface Plugin {
  metadata: PluginMetadata
  activate: () => Promise<void>
  deactivate: () => Promise<void>
  execute?: (input: any) => Promise<any>
}

// ━━━ PLUGIN REGISTRY ━━━
class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map()

  register(plugin: Plugin): boolean {
    if (this.plugins.has(plugin.metadata.id)) {
      console.warn(`Plugin ${plugin.metadata.id} already registered`)
      return false
    }
    this.plugins.set(plugin.metadata.id, plugin)
    return true
  }

  unregister(id: string): boolean {
    return this.plugins.delete(id)
  }

  async activate(id: string): Promise<boolean> {
    const plugin = this.plugins.get(id)
    if (!plugin) return false
    try {
      await plugin.activate()
      plugin.metadata.enabled = true
      return true
    } catch (error) {
      console.error(`Failed to activate ${id}:`, error)
      return false
    }
  }

  async deactivate(id: string): Promise<boolean> {
    const plugin = this.plugins.get(id)
    if (!plugin) return false
    try {
      await plugin.deactivate()
      plugin.metadata.enabled = false
      return true
    } catch (error) {
      console.error(`Failed to deactivate ${id}:`, error)
      return false
    }
  }

  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  listPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  getEnabledPlugins(category?: string): Plugin[] {
    return Array.from(this.plugins.values()).filter(p =>
      p.metadata.enabled && (!category || p.metadata.category === category)
    )
  }
}

export const registry = new PluginRegistry()

// ━━━ EXAMPLE PLUGINS ━━━

// Plugin 1: Collections
export const collectionsPlugin: Plugin = {
  metadata: {
    id: 'collections',
    name: 'Collections',
    version: '1.0.0',
    author: 'JARVIS',
    description: 'Save and organize important responses',
    category: 'tool',
    enabled: true,
  },
  activate: async () => {
    console.log('✅ Collections plugin activated')
  },
  deactivate: async () => {
    console.log('❌ Collections plugin deactivated')
  },
  execute: async (input: any) => {
    // Save to collection
    return { saved: true }
  },
}

// Plugin 2: Custom Instructions
export const customInstructionsPlugin: Plugin = {
  metadata: {
    id: 'custom-instructions',
    name: 'Custom Instructions',
    version: '1.0.0',
    author: 'JARVIS',
    description: 'Remember and apply user preferences',
    category: 'tool',
    enabled: true,
  },
  activate: async () => {
    console.log('✅ Custom Instructions plugin activated')
  },
  deactivate: async () => {
    console.log('❌ Custom Instructions plugin deactivated')
  },
  execute: async (input: any) => {
    return { applied: true }
  },
}

// Plugin 3: Connected Apps (Template)
export const connectedAppsPlugin: Plugin = {
  metadata: {
    id: 'connected-apps',
    name: 'Connected Apps',
    version: '1.0.0',
    author: 'JARVIS',
    description: 'Connect to Gmail, GitHub, Calendar, etc',
    category: 'integration',
    enabled: true,
    dependencies: ['oauth'],
  },
  activate: async () => {
    console.log('✅ Connected Apps plugin activated')
  },
  deactivate: async () => {
    console.log('❌ Connected Apps plugin deactivated')
  },
  execute: async (input: any) => {
    // Handle connected app actions
    return { status: 'ok' }
  },
}

// Plugin 4: Message Actions
export const messageActionsPlugin: Plugin = {
  metadata: {
    id: 'message-actions',
    name: 'Message Actions',
    version: '1.0.0',
    author: 'JARVIS',
    description: 'Copy, Edit, Regenerate, Pin, Delete messages',
    category: 'ui',
    enabled: true,
  },
  activate: async () => {
    console.log('✅ Message Actions plugin activated')
  },
  deactivate: async () => {
    console.log('❌ Message Actions plugin deactivated')
  },
  execute: async (input: any) => {
    const { action, messageId } = input
    return { action, messageId, success: true }
  },
}

// Plugin 5: Auto-Learning
export const autoLearningPlugin: Plugin = {
  metadata: {
    id: 'auto-learning',
    name: 'Auto Learning',
    version: '1.0.0',
    author: 'JARVIS',
    description: 'Learn and improve from user behavior',
    category: 'analysis',
    enabled: true,
  },
  activate: async () => {
    console.log('✅ Auto Learning plugin activated')
    // Start periodic analysis
    setInterval(() => {
      console.log('🧠 Analyzing patterns...')
    }, 3600000) // Every hour
  },
  deactivate: async () => {
    console.log('❌ Auto Learning plugin deactivated')
  },
  execute: async (input: any) => {
    return { analyzed: true }
  },
}

// Plugin 6: Agentic Actions
export const agenticPlugin: Plugin = {
  metadata: {
    id: 'agentic',
    name: 'Agentic System',
    version: '1.0.0',
    author: 'JARVIS',
    description: 'ReAct pattern for autonomous reasoning and acting',
    category: 'action',
    enabled: true,
  },
  activate: async () => {
    console.log('✅ Agentic System activated')
  },
  deactivate: async () => {
    console.log('❌ Agentic System deactivated')
  },
  execute: async (input: any) => {
    // Run agentic task
    return { completed: true }
  },
}

// ━━━ PLUGIN LOADER ━━━
export function initializePlugins(): void {
  const pluginsToLoad = [
    collectionsPlugin,
    customInstructionsPlugin,
    connectedAppsPlugin,
    messageActionsPlugin,
    autoLearningPlugin,
    agenticPlugin,
  ]

  for (const plugin of pluginsToLoad) {
    registry.register(plugin)
  }

  console.log(`📦 ${pluginsToLoad.length} plugins registered`)
}

export async function activateAllPlugins(): Promise<void> {
  const plugins = registry.listPlugins()
  for (const plugin of plugins) {
    if (plugin.metadata.enabled) {
      await registry.activate(plugin.metadata.id)
    }
  }
  console.log('✅ All enabled plugins activated')
}

// ━━━ EASY FEATURE ADDITION TEMPLATE ━━━
/*
To add a new feature, create a plugin like this:

export const myNewFeaturePlugin: Plugin = {
  metadata: {
    id: 'my-feature',
    name: 'My Feature',
    version: '1.0.0',
    author: 'Your Name',
    description: 'What does this feature do',
    category: 'tool', // or 'integration', 'ui', 'action', 'analysis'
    enabled: true,
    dependencies: [], // Other plugins needed
  },
  activate: async () => {
    // Initialize feature
  },
  deactivate: async () => {
    // Cleanup
  },
  execute: async (input: any) => {
    // Main logic
    return { result: 'success' }
  },
}

// Then in initializePlugins():
registry.register(myNewFeaturePlugin)
*/

// ━━━ HOW TO USE IN CODE ━━━
/*
// Get a plugin
const plugin = registry.getPlugin('collections')

// Execute plugin
const result = await plugin?.execute({ action: 'save', data: {...} })

// List all plugins
const allPlugins = registry.listPlugins()

// Get only enabled plugins
const enabled = registry.getEnabledPlugins('tool')

// Enable/Disable
await registry.activate('my-feature')
await registry.deactivate('my-feature')
*/
