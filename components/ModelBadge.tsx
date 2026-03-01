// components/ModelBadge.tsx — Show which AI model is being used

'use client'

interface ModelBadgeProps {
  model?: string
  showEmoji?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function ModelBadge({ model = 'unknown', showEmoji = true, size = 'small' }: ModelBadgeProps) {
  const getModelConfig = (modelName: string) => {
    const configs: Record<string, { label: string; emoji: string; bg: string; color: string }> = {
      'gemini-1.5-flash': {
        label: 'GEMINI',
        emoji: '⚡',
        bg: 'rgba(251, 188, 5, 0.1)',
        color: '#fbc805',
      },
      'gemini-2.0-flash': {
        label: 'GEMINI 2.0',
        emoji: '⚡',
        bg: 'rgba(251, 188, 5, 0.1)',
        color: '#fbc805',
      },
      'claude-3.5-sonnet': {
        label: 'CLAUDE',
        emoji: '🧠',
        bg: 'rgba(100, 200, 100, 0.1)',
        color: '#64c864',
      },
      'llama-3.1': {
        label: 'LLAMA',
        emoji: '🦙',
        bg: 'rgba(200, 100, 50, 0.1)',
        color: '#c86432',
      },
      'gpt-4o-mini': {
        label: 'GPT-4',
        emoji: '🤖',
        bg: 'rgba(100, 150, 255, 0.1)',
        color: '#6496ff',
      },
      'groq': {
        label: 'GROQ',
        emoji: '⚙️',
        bg: 'rgba(100, 100, 100, 0.1)',
        color: '#666666',
      },
    }

    // Find matching config
    for (const [key, config] of Object.entries(configs)) {
      if (modelName.includes(key.split('-')[0])) {
        return config
      }
    }

    // Default
    return {
      label: modelName.toUpperCase(),
      emoji: '🤖',
      bg: 'rgba(255, 26, 136, 0.1)',
      color: '#ff1a88',
    }
  }

  const config = getModelConfig(model)

  const sizeStyles = {
    small: {
      padding: '2px 8px',
      fontSize: 9,
      gap: 3,
    },
    medium: {
      padding: '4px 12px',
      fontSize: 11,
      gap: 4,
    },
    large: {
      padding: '6px 16px',
      fontSize: 13,
      gap: 6,
    },
  }

  const style = sizeStyles[size]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: style.gap,
        padding: style.padding,
        borderRadius: 20,
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}33`,
        fontWeight: 700,
        letterSpacing: 0.8,
        fontFamily: 'Courier New, monospace',
        fontSize: style.fontSize,
        whiteSpace: 'nowrap',
      }}
      title={`Responded by: ${config.label}`}
    >
      {showEmoji && <span>{config.emoji}</span>}
      <span>{config.label}</span>
    </span>
  )
}

// ━━━ MODEL INFO COMPONENT ━━━
export function ModelInfo({ model }: { model?: string }) {
  const modelInfo: Record<string, { description: string; speed: string; accuracy: string }> = {
    'gemini-1.5-flash': {
      description: 'Fast and efficient',
      speed: '⚡ Very Fast',
      accuracy: '🎯 High',
    },
    'claude-3.5-sonnet': {
      description: 'Balanced and reliable',
      speed: '⚡ Fast',
      accuracy: '🎯 Very High',
    },
    'llama-3.1': {
      description: 'Open-source powerhouse',
      speed: '⚡ Fast',
      accuracy: '🎯 High',
    },
    'gpt-4o-mini': {
      description: 'Efficient and capable',
      speed: '⚡ Very Fast',
      accuracy: '🎯 High',
    },
    'groq': {
      description: 'Lightning fast inference',
      speed: '⚡⚡⚡ Fastest',
      accuracy: '🎯 Good',
    },
  }

  const info = modelInfo[model || 'unknown'] || {
    description: 'AI model',
    speed: '⚡ Standard',
    accuracy: '🎯 Good',
  }

  return (
    <div style={{ fontSize: 12, color: '#6b6b8a' }}>
      <div>{info.description}</div>
      <div>
        {info.speed} • {info.accuracy}
      </div>
    </div>
  )
}
