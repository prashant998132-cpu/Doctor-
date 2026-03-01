'use client'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Plus, Settings, Wrench, Camera, X, Menu, Search, Square, ChevronDown, Copy, RotateCcw, ThumbsUp, ThumbsDown, Globe } from 'lucide-react'
import TypewriterText from '@/components/TypewriterText'
import SoundWave from '@/components/SoundWave'
import ToolCard from '@/components/ToolCard'
import CommandPalette from '@/components/CommandPalette'
import SmartSettings from '@/components/SmartSettings'
import { MessageActions } from '@/components/MessageActions'
import { AnimatedGlassBackground } from '@/components/AnimatedGlassBackground'
import { ModelBadge } from '@/components/ModelBadge'

import { TOOLS } from '@/lib/links'
import { semanticMemory } from '@/lib/semanticMemory'
import { agentRouter } from '@/lib/multiAgent'
import { reminderManager } from '@/lib/reminders'
import { selfCorrection } from '@/lib/selfCorrection'
import { cloudBackup } from '@/lib/cloudBackup'
import {
  lsSet, getActiveChat, newChat, saveChat,
  getRelationship, incrementInteraction, updateStreak, getLevelProgress,
  getPreferences, extractProfileInfo, exportAllData,
  getProfile, trackBehavior, saveToCollection,
  getChats, deleteChat,
  type Message, type Chat, type Relationship,
} from '@/lib/memory'
import { storageManager } from '@/lib/storage'
import {
  detectMode, detectEmotionSmart,
  getGreeting, getProactiveSuggestion, keywordFallback,
  getTonyStarkResponse, getAutoTheme,
  speak as speakUtil, stopSpeaking,
} from '@/lib/intelligence'
import { initializePlugins, activateAllPlugins } from '@/lib/plugins'

const LEVEL_NAMES = ['','Stranger','Acquaintance','Friend','Best Friend','JARVIS MODE']

// ━━━ MARKDOWN RENDERER ━━━
function MD({ text }: { text: string }) {
  const render = useMemo(() => {
    const lines = text.split('\n')
    const result: React.ReactNode[] = []
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      // Code block
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || 'code'
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]); i++
        }
        const code = codeLines.join('\n')
        result.push(
          <pre key={i}>
            <div className="code-header">
              <span className="code-lang">{lang}</span>
              <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(code)}>
                📋 Copy
              </button>
            </div>
            <code>{code}</code>
          </pre>
        )
        i++; continue
      }
      // Headings
      if (line.startsWith('### ')) { result.push(<h3 key={i}>{inline(line.slice(4))}</h3>); i++; continue }
      if (line.startsWith('## ')) { result.push(<h2 key={i}>{inline(line.slice(3))}</h2>); i++; continue }
      if (line.startsWith('# ')) { result.push(<h1 key={i}>{inline(line.slice(2))}</h1>); i++; continue }
      // Blockquote
      if (line.startsWith('> ')) { result.push(<blockquote key={i}>{inline(line.slice(2))}</blockquote>); i++; continue }
      // Bullet list
      if (line.match(/^[-*•] /)) {
        const items: string[] = []
        while (i < lines.length && lines[i].match(/^[-*•] /)) { items.push(lines[i].slice(2)); i++ }
        result.push(<ul key={i}>{items.map((it,j)=><li key={j}>{inline(it)}</li>)}</ul>)
        continue
      }
      // Numbered list
      if (line.match(/^\d+\. /)) {
        const items: string[] = []
        while (i < lines.length && lines[i].match(/^\d+\. /)) { items.push(lines[i].replace(/^\d+\. /,'')); i++ }
        result.push(<ol key={i}>{items.map((it,j)=><li key={j}>{inline(it)}</li>)}</ol>)
        continue
      }
      // Empty line
      if (line.trim() === '') { i++; continue }
      // Paragraph
      result.push(<p key={i}>{inline(line)}</p>)
      i++
    }
    return result
  }, [text])

  return <div className="msg-body">{render}</div>
}

function inline(text: string): React.ReactNode {
  // bold, italic, inline code, links
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_|\[.+?\]\(.+?\))/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') || p.startsWith('__')) return <strong key={i}>{p.slice(2,-2)}</strong>
    if (p.startsWith('*') || p.startsWith('_')) return <em key={i}>{p.slice(1,-1)}</em>
    if (p.startsWith('`')) return <code key={i}>{p.slice(1,-1)}</code>
    if (p.startsWith('[')) {
      const m = p.match(/\[(.+?)\]\((.+?)\)/)
      if (m) return <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>
    }
    return p
  })
}

// ━━━ MODEL CONFIG ━━━
const MODEL_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  'gemini':        { label: 'GEMINI 1.5 FLASH', color: '#4285F4', bg: 'rgba(66,133,244,0.12)', emoji: '✦' },
  'gemini-vision': { label: 'GEMINI VISION',    color: '#4285F4', bg: 'rgba(66,133,244,0.12)', emoji: '👁️' },
  'groq':          { label: 'GROQ LLAMA3',       color: '#F55036', bg: 'rgba(245,80,54,0.12)',  emoji: '⚡' },
  'openrouter':    { label: 'MISTRAL',           color: '#FF7000', bg: 'rgba(255,112,0,0.12)',  emoji: '🌬️' },
  'aimlapi':       { label: 'AIML MISTRAL',      color: '#9B59B6', bg: 'rgba(155,89,182,0.12)', emoji: '🧠' },
  'keyword':       { label: 'OFFLINE',           color: '#555',    bg: 'rgba(255,255,255,0.05)', emoji: '💾' },
}

function getModelConfig(model?: string) {
  if (!model) return null
  const key = Object.keys(MODEL_CONFIG).find(k => model.toLowerCase().includes(k))
  return key ? MODEL_CONFIG[key] : null
}

// ━━━ MESSAGE ROW ━━━
function MsgRow({ msg, isNew, tts, onRegenerate }: {
  msg: Message; isNew: boolean; tts: boolean; onRegenerate?: () => void
}) {
  const isJ = msg.role === 'jarvis'
  const [copied, setCopied] = useState(false)
  const modelCfg = isJ ? getModelConfig(msg.model) : null

  useEffect(() => {
    if (isNew && isJ && tts) speakUtil(msg.content)
  }, [isNew, isJ, tts, msg.content])

  const copy = () => {
    navigator.clipboard?.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={`msg-row ${isJ ? 'jarvis-row' : 'user-row'} fade-in`}>
      {/* Header */}
      <div className="msg-header">
        {/* Avatar — color changes based on model */}
        <div className={`msg-avatar ${isJ ? 'avatar-j' : 'avatar-u'}`}
          style={isJ && modelCfg ? {
            background: `linear-gradient(135deg, ${modelCfg.color}, ${modelCfg.color}99)`,
            boxShadow: `0 0 10px ${modelCfg.color}44`,
          } : undefined}>
          {isJ ? '🤖' : '👤'}
        </div>
        <span className="msg-name">{isJ ? 'JARVIS' : 'You'}</span>
        {/* Model Badge */}
        {isJ && msg.model && (
          <ModelBadge model={msg.model} size="small" />
        )}
        <span className="msg-time">
          {new Date(msg.timestamp).toLocaleTimeString('hi-IN',{hour:'2-digit',minute:'2-digit'})}
        </span>
      </div>

      {/* Image if any */}
      {msg.imageUrl && (
        <div style={{paddingLeft:38,marginBottom:8}}>
          <img src={msg.imageUrl} alt="upload" style={{maxWidth:'min(400px,100%)',borderRadius:10,border:'1px solid var(--border)',display:'block'}}/>
        </div>
      )}

      {/* Body */}
      {isNew && isJ
        ? <div className="msg-body"><TypewriterText text={msg.content}/></div>
        : <MD text={msg.content}/>
      }

      {/* Tool chips */}
      {msg.tools && msg.tools.length > 0 && (
        <div className="tool-chips">
          {msg.tools.map(t=>(
            <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" className="tool-chip">
              🔗 {t.name}
            </a>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="group">
        <MessageActions
          messageId={msg.id}
          content={msg.content}
          onAction={(action) => {
            switch (action) {
              case 'copy':
                copy()
                break
              case 'regenerate':
                onRegenerate?.()
                break
              case 'pin':
                // TODO: Pin message
                break
              case 'delete':
                // TODO: Delete message
                break
              case 'share':
                // Save to collections
                saveToCollection({
                  id: `col_${Date.now()}`,
                  messageId: msg.id,
                  content: msg.content,
                  savedAt: Date.now(),
                  tags: [],
                })
                break
            }
          }}
        />
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div className="typing-row">
      <div className="msg-avatar avatar-j" style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>🤖</div>
      {[0,1,2].map(i=>(
        <motion.div key={i} className="t-dot"
          animate={{y:[0,-4,0]}}
          transition={{duration:0.6,repeat:Infinity,delay:i*0.15}}/>
      ))}
    </div>
  )
}

// ━━━ SIDEBAR ━━━
function Sidebar({ chat, onNew, onSelect, onDelete, onClose, isMobile }: {
  chat: Chat | null; onNew:()=>void; onSelect:(c:Chat)=>void; onDelete:(id:string)=>void; onClose?:()=>void; isMobile?:boolean
}) {
  const [q, setQ] = useState('')
  const rel = getRelationship()
  const streak = updateStreak()
  const progress = getLevelProgress(rel)
  const allChats = getChats().sort((a,b)=>b.updatedAt-a.updatedAt)

  const now = Date.now()
  const today = allChats.filter(c => now - c.updatedAt < 86400000)
  const yesterday = allChats.filter(c => now - c.updatedAt >= 86400000 && now - c.updatedAt < 172800000)
  const older = allChats.filter(c => now - c.updatedAt >= 172800000)

  const filtered = (list: Chat[]) => q ? list.filter(c=>c.title.toLowerCase().includes(q.toLowerCase())) : list

  const Row = ({ c }: { c: Chat }) => (
    <div className={`chat-row${chat?.id===c.id?' active':''}`} onClick={()=>{onSelect(c);onClose?.()}}>
      <span className="chat-row-title">{c.title||'New Chat'}</span>
      <button className="chat-row-del" onClick={e=>{e.stopPropagation();onDelete(c.id)}}>
        <X size={12}/>
      </button>
    </div>
  )

  return (
    <>
      <div className="sidebar-top">
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#ff1a88,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,boxShadow:'0 0 14px rgba(255,26,136,0.3)'}}>🤖</div>
            <div>
              <div style={{fontFamily:'Courier New',fontSize:15,color:'#ff1a88',fontWeight:700,letterSpacing:3}}>JARVIS</div>
              <div style={{fontSize:9,color:'var(--text3)'}}>v7 · ₹0 Forever</div>
            </div>
          </div>
          {isMobile && <button className="icon-btn" onClick={onClose}><X size={16}/></button>}
        </div>

        {/* Level */}
        <div className="level-pill">
          <span style={{fontSize:11,color:'var(--pink)',fontWeight:700,whiteSpace:'nowrap'}}>
            Lv.{rel.level} {LEVEL_NAMES[rel.level]}
          </span>
          <div className="level-xp">
            <div className="level-xp-fill" style={{width:`${progress}%`}}/>
          </div>
          <span style={{fontSize:10,color:'var(--text3)',whiteSpace:'nowrap'}}>
            {streak.currentStreak>0?`🔥${streak.currentStreak}d`:`⚡${rel.xp}xp`}
          </span>
        </div>

        {/* New chat */}
        <button className="new-chat" onClick={()=>{onNew();onClose?.()}} style={{marginTop:8}}>
          <Plus size={15}/> New Chat
        </button>

        {/* Search */}
        <div style={{position:'relative',marginTop:8}}>
          <Search size={12} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text3)'}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search chats..."
            style={{width:'100%',padding:'7px 10px 7px 28px',background:'rgba(255,255,255,0.04)',border:'1px solid var(--border2)',borderRadius:8,color:'var(--text)',fontSize:12,outline:'none',boxSizing:'border-box'}}/>
        </div>
      </div>

      {/* Chat list */}
      <div className="chat-list">
        {filtered(today).length>0 && <>
          <div className="section-label">Today</div>
          {filtered(today).map(c=><Row key={c.id} c={c}/>)}
        </>}
        {filtered(yesterday).length>0 && <>
          <div className="section-label">Yesterday</div>
          {filtered(yesterday).map(c=><Row key={c.id} c={c}/>)}
        </>}
        {filtered(older).length>0 && <>
          <div className="section-label">Older</div>
          {filtered(older).map(c=><Row key={c.id} c={c}/>)}
        </>}
        {allChats.length===0 && (
          <div style={{padding:'20px 10px',textAlign:'center',fontSize:12,color:'var(--text3)'}}>
            Koi chat nahi
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <a href="/jarvis-knows" target="_blank" className="sidebar-link">👁️ What JARVIS Knows</a>
        <button className="sidebar-link" onClick={exportAllData}>💾 Export Backup</button>
      </div>
    </>
  )
}

// ━━━ TOOLS PANEL ━━━
function ToolsPanel({ onClose }: { onClose:()=>void }) {
  const [cat,setCat] = useState('all')
  const [q,setQ] = useState('')
  const cats = ['all','image','video','audio','image-edit','upscale','code','design','writing','tts','chat','productivity','learning']
  const tools = TOOLS.filter(t=>(cat==='all'||t.category===cat)&&(q===''||t.name.toLowerCase().includes(q.toLowerCase())||t.tag.toLowerCase().includes(q.toLowerCase())))

  return (
    <div className="tools-panel">
      <div style={{padding:'14px 14px 10px',borderBottom:'1px solid var(--border2)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <span style={{fontWeight:700,color:'var(--text)',fontSize:14}}>🛠️ {tools.length} Tools</span>
        <button className="icon-btn" onClick={onClose}><X size={16}/></button>
      </div>
      <div style={{padding:'8px 10px 0',flexShrink:0}}>
        <div style={{position:'relative'}}>
          <Search size={12} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text3)'}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tools..."
            style={{width:'100%',padding:'7px 10px 7px 28px',background:'rgba(255,255,255,0.04)',border:'1px solid var(--border2)',borderRadius:8,color:'var(--text)',fontSize:12,outline:'none',boxSizing:'border-box'}}/>
        </div>
      </div>
      <div style={{display:'flex',gap:5,padding:'8px 10px',overflowX:'auto',flexShrink:0}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            style={{padding:'4px 10px',borderRadius:20,border:'none',cursor:'pointer',whiteSpace:'nowrap',fontSize:11,fontWeight:600,
              background:cat===c?'linear-gradient(135deg,#ff1a88,#7c3aed)':'rgba(255,255,255,0.06)',
              color:cat===c?'white':'var(--text3)'}}>
            {c==='all'?'⭐ All':c}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'4px 10px 12px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
        {tools.map(t=><ToolCard key={t.id} tool={t}/>)}
      </div>
    </div>
  )
}

// ━━━ ATTACHMENT MENU ━━━
function AttachMenu({ onCamera, onGallery, onPDF, onClose }: {
  onCamera:()=>void; onGallery:()=>void; onPDF:()=>void; onClose:()=>void
}) {
  const items = [
    {icon:'📷', bg:'rgba(255,100,100,0.12)', label:'Camera se photo', action:onCamera},
    {icon:'🖼️', bg:'rgba(100,100,255,0.12)', label:'Gallery se image', action:onGallery},
    {icon:'📄', bg:'rgba(100,200,100,0.12)', label:'PDF / Document', action:onPDF},
  ]
  return (
    <motion.div className="attach-popup"
      initial={{opacity:0,y:8,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:0.95}}
      transition={{type:'spring',damping:25}}>
      {items.map(it=>(
        <div key={it.label} className="attach-item" onClick={()=>{it.action();onClose()}}>
          <div className="attach-icon" style={{background:it.bg}}>{it.icon}</div>
          <span>{it.label}</span>
        </div>
      ))}
    </motion.div>
  )
}

// ━━━ MAIN ━━━
export default function ChatInterface() {
  const [chat, setChat] = useState<Chat>(()=>getActiveChat()||newChat())
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [listening, setListening] = useState(false)
  const [relationship, setRelationship] = useState<Relationship>(getRelationship())
  const [prefs] = useState(getPreferences())
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const [showTools, setShowTools] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCmd, setShowCmd] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const [batteryLevel, setBattery] = useState<number|undefined>()

  const bottomRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)
  const recRef = useRef<any>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const msgsRef = useRef<HTMLDivElement>(null)
  const stopRef = useRef(false)

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768)
    check(); window.addEventListener('resize',check)
    updateStreak()
    
    // Initialize plugins
    initializePlugins()
    activateAllPlugins().catch(e=>console.error('Plugin activation failed:',e))
    
    // Load semantic memory
    semanticMemory.load()
    
    // Request notification permission for reminders
    reminderManager.requestNotificationPermission().catch(console.error)
    
    // Run storage optimization periodically
    storageManager.optimize().catch(e=>console.error('Storage optimization failed:',e))
    const storageInterval = setInterval(() => {
      storageManager.optimize()
    }, 3600000) // Every hour
    
    if('getBattery' in navigator)(navigator as any).getBattery().then((b:any)=>{setBattery(b.level);b.addEventListener('levelchange',()=>setBattery(b.level))})
    if(prefs.autoTheme) document.documentElement.setAttribute('data-theme',getAutoTheme())
    
    return ()=>{
      window.removeEventListener('resize',check)
      clearInterval(storageInterval)
    }
  },[prefs.autoTheme])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[chat.messages,thinking])

  const onScroll = useCallback(()=>{
    if(!msgsRef.current) return
    const {scrollTop,scrollHeight,clientHeight} = msgsRef.current
    setShowScrollBtn(scrollHeight-scrollTop-clientHeight > 200)
  },[])

  const haptic=(t:'light'|'medium'|'heavy'='light')=>{
    if(!prefs.hapticEnabled) return
    try{navigator.vibrate?.({light:[10],medium:[30],heavy:[50,30,50]}[t])}catch{}
  }

  const startVoice=useCallback(()=>{
    const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition
    if(!SR){setInput('Voice support nahi hai');return}
    if(recRef.current){recRef.current.stop();return}
    const r=new SR(); r.lang='hi-IN'; r.continuous=false; r.interimResults=false
    recRef.current=r; setListening(true); haptic('medium')
    r.onresult=(e:any)=>{setInput(e.results[0][0].transcript);r.stop()}
    r.onend=()=>{setListening(false);recRef.current=null}
    r.onerror=()=>{setListening(false);recRef.current=null}
    r.start()
  },[])

  const handleImg=useCallback(async(file:File)=>{
    const reader=new FileReader()
    reader.onload=async(e)=>{
      const b64=(e.target?.result as string).split(',')[1]
      const imgUrl=e.target?.result as string
      const um:Message={id:`u${Date.now()}`,role:'user',content:'📸 Photo bheja — analyze karo',timestamp:Date.now(),imageUrl:imgUrl}
      const u={...chat,messages:[...chat.messages,um],updatedAt:Date.now()}
      setChat(u);saveChat(u);setThinking(true)
      try{
        const res=await fetch('/api/vision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageBase64:b64,mimeType:file.type})})
        const data=await res.json()
        const jm:Message={id:`j${Date.now()}`,role:'jarvis',content:data.result||'Analyze nahi ho paya.',timestamp:Date.now(),model:'gemini-vision'}
        const f={...u,messages:[...u.messages,jm],updatedAt:Date.now()}
        setChat(f);saveChat(f);setNewIds(new Set([jm.id]))
      }catch{}
      setThinking(false)
    }
    reader.readAsDataURL(file)
  },[chat])

  const fetchWeather=useCallback(async()=>{
    try{
      navigator.geolocation?.getCurrentPosition(
        async pos=>{const r=await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);const d=await r.json();if(!d.error)setWeather(d)},
        async()=>{const r=await fetch('/api/weather?city=Delhi');const d=await r.json();if(!d.error)setWeather(d)}
      )
    }catch{}
  },[])

  const send=useCallback(async(override?:string)=>{
    const text=(override||input).trim()
    if(!text||thinking) return
    stopSpeaking(); setInput(''); haptic('light')
    extractProfileInfo(text)
    
    // Index message in semantic memory
    semanticMemory.addEntry(text, chat.id, 'message')
    
    if(taRef.current) taRef.current.style.height='auto'
    stopRef.current=false

    const mode=detectMode(text)
    const um:Message={id:`u${Date.now()}`,role:'user',content:text,timestamp:Date.now(),mode}
    const upd:Chat={...chat,messages:[...chat.messages,um],title:chat.messages.length===0?text.slice(0,40):chat.title,updatedAt:Date.now()}
    setChat(upd);saveChat(upd);setThinking(true)

    try{
      const emotion=await detectEmotionSmart(text)

      if(mode==='weather'){
        await fetchWeather()
        const jm:Message={id:`j${Date.now()}`,role:'jarvis',content:weather?`🌤️ ${weather.city}: ${weather.temp}°C, ${weather.description}`:'Location fetch ho raha hai...',timestamp:Date.now()}
        const f={...upd,messages:[...upd.messages,jm],updatedAt:Date.now()}
        setChat(f);saveChat(f);setNewIds(new Set([jm.id]));setThinking(false);return
      }

      if(mode==='search'||webSearch){
        const q=text.replace(/search|dhundho|find/gi,'').trim()
        const res=await fetch(`/api/search?q=${encodeURIComponent(q||text)}`)
        const data=await res.json()
        let result=''
        if(data.answer) result+=`**${data.answer}**\n\n`
        if(data.abstract) result+=`${data.abstract}\n\n`
        if(data.relatedTopics?.length) result+='**Related:**\n'+data.relatedTopics.slice(0,3).map((t:any)=>`- ${t.text}`).join('\n')
        const jm:Message={id:`j${Date.now()}`,role:'jarvis',content:`🔍 **Search Results**\n\n${result||'Nahi mila.'}`,timestamp:Date.now()}
        const f={...upd,messages:[...upd.messages,jm],updatedAt:Date.now()}
        setChat(f);saveChat(f);setNewIds(new Set([jm.id]));setThinking(false);return
      }

      const res=await fetch('/api/intent',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({input:text,context:upd.messages.slice(-8).map(m=>({role:m.role,content:m.content})),level:relationship.level,personality:prefs.personalityMode}),
      })

      if(stopRef.current){setThinking(false);return}

      let content='',tools:Message['tools']=[],model='keyword'
      if(res.ok){
        const data=await res.json()
        if(data.useKeywordFallback){
          const fb=keywordFallback(text)
          content=fb?fb.response+'\n\n'+getTonyStarkResponse(emotion,updateStreak().currentStreak):getTonyStarkResponse(emotion,0)+'\n\nSir, AI nahi mila. Net check karo.'
          if(fb) tools=TOOLS.filter(t=>fb.tools.some((n:string)=>t.name.toLowerCase().includes(n.toLowerCase()))).slice(0,4).map(t=>({id:t.id,name:t.name,url:t.url}))
        }else{
          content=data.response||getTonyStarkResponse(emotion,0)
          model=data.model||'gemini'
          if(data.tonyStarkComment&&Math.random()>0.6) content+=`\n\n*${data.tonyStarkComment}*`
          if(data.tools) tools=TOOLS.filter(t=>(data.tools as string[]).some((n:string)=>t.name.toLowerCase().includes(n.toLowerCase()))).slice(0,4).map(t=>({id:t.id,name:t.name,url:t.url}))
        }
      }else{
        const fb=keywordFallback(text)
        content=fb?fb.response:getTonyStarkResponse(emotion,0)
      }

      if(stopRef.current){setThinking(false);return}

      const jm:Message={id:`j${Date.now()}`,role:'jarvis',content,timestamp:Date.now(),model,tools:tools.length?tools:undefined,emotion}
      const final:Chat={...upd,messages:[...upd.messages,jm],updatedAt:Date.now()}
      setChat(final);saveChat(final);setNewIds(new Set([jm.id]))
      
      // Index response in semantic memory
      semanticMemory.addEntry(content, chat.id, 'message')

      const{relationship:newRel}=incrementInteraction()
      setRelationship(newRel)
    }catch{
      const em:Message={id:`e${Date.now()}`,role:'jarvis',content:'Sir, error aa gaya. Net check karo. 🔄',timestamp:Date.now()}
      setChat(f=>({...f,messages:[...f.messages,em],updatedAt:Date.now()}))
    }finally{
      setThinking(false);setStopping(false)
    }
  },[input,thinking,chat,relationship,prefs,haptic,fetchWeather,weather,webSearch])

  const stop=()=>{stopRef.current=true;setStopping(true)}

  const regenerate=useCallback(()=>{
    const msgs=chat.messages
    const lastUser=msgs.filter(m=>m.role==='user').at(-1)
    if(!lastUser) return
    const withoutLast={...chat,messages:msgs.slice(0,-1),updatedAt:Date.now()}
    setChat(withoutLast);saveChat(withoutLast)
    send(lastUser.content)
  },[chat,send])

  const doNew=()=>{const c=newChat();setChat(c);lsSet('jarvis_active_chat',c.id)}
  const doSelect=(c:Chat)=>{setChat(c);lsSet('jarvis_active_chat',c.id)}
  const doDelete=(id:string)=>{deleteChat(id);if(chat.id===id) doNew()}

  const handleCmd=useCallback((action:string)=>{
    if(action==='clear') doNew()
    else if(action==='export') exportAllData()
    else if(action==='privacy') window.open('/jarvis-knows','_blank')
    else if(action==='weather') fetchWeather()
    else if(action==='vision') galleryRef.current?.click()
    else if(action==='settings') setShowSettings(true)
    else if(action==='tools') setShowTools(true)
  },[fetchWeather])

  const QUICK = [
    {e:'🎨',l:'Image banana hai',m:'ek free AI image generator suggest karo'},
    {e:'🎵',l:'Music chahiye',m:'free AI music generator suggest karo'},
    {e:'💻',l:'Code help',m:'coding mein help chahiye'},
    {e:'🌤️',l:'Mausam',m:'aaj ka mausam kaisa hai?'},
    {e:'✍️',l:'Writing help',m:'writing tool suggest karo'},
    {e:'🎬',l:'Video banana hai',m:'free AI video generator suggest karo'},
  ]

  return (
    <div className="app">
      {/* Animated Glassmorphism Background */}
      <AnimatedGlassBackground />

      {/* Hidden file inputs */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)handleImg(f);e.target.value=''}}/>
      <input ref={galleryRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)handleImg(f);e.target.value=''}}/>
      <input ref={pdfRef} type="file" accept=".pdf" style={{display:'none'}} onChange={e=>{}}/>

      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="sidebar">
          <Sidebar chat={chat} onNew={doNew} onSelect={doSelect} onDelete={doDelete}/>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobile && mobileSidebar && (
          <>
            <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setMobileSidebar(false)}/>
            <motion.div className="mobile-sidebar" initial={{x:-280}} animate={{x:0}} exit={{x:-280}} transition={{type:'spring',damping:28,stiffness:280}}>
              <Sidebar chat={chat} onNew={doNew} onSelect={doSelect} onDelete={doDelete} onClose={()=>setMobileSidebar(false)} isMobile/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          {isMobile && <button className="icon-btn" onClick={()=>setMobileSidebar(true)}><Menu size={20}/></button>}
          <div className="topbar-title">{chat.title||'New Chat'}</div>

          {weather && (
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:'rgba(0,212,255,0.06)',border:'1px solid rgba(0,212,255,0.15)',borderRadius:20,fontSize:12,color:'#00d4ff',flexShrink:0}}>
              🌤️ {weather.temp}°C
              <button onClick={()=>setWeather(null)} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',padding:0,fontSize:11}}>✕</button>
            </div>
          )}

          <button className={`icon-btn${webSearch?' on':''}`} onClick={()=>setWebSearch(v=>!v)} title="Web Search">
            <Globe size={17}/>
          </button>
          <button className={`icon-btn${showTools?' on':''}`} onClick={()=>setShowTools(v=>!v)} title="Tools">
            <Wrench size={17}/>
          </button>
          <button className="icon-btn" onClick={()=>setShowSettings(true)} title="Settings">
            <Settings size={17}/>
          </button>
        </div>

        {/* Messages */}
        <div className="messages" ref={msgsRef} onScroll={onScroll} style={{position:'relative'}}>
          <div className="messages-inner">

            {chat.messages.length===0 && (
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
                style={{textAlign:'center',padding:'60px 20px 40px'}}>
                <div style={{fontSize:60,marginBottom:16,filter:'drop-shadow(0 0 24px rgba(255,26,136,0.35))'}}>🤖</div>
                <h1 style={{fontFamily:'Courier New',fontSize:26,color:'#ff1a88',letterSpacing:4,marginBottom:6,fontWeight:700}}>JARVIS</h1>
                <p style={{color:'var(--text2)',fontSize:15,marginBottom:8}}>
                  {getGreeting(relationship.level,getProfile(),updateStreak().currentStreak)}
                </p>
                <p style={{color:'var(--text3)',fontSize:13,marginBottom:36}}>
                  145+ free AI tools · Hindi + English · ₹0 Forever
                </p>
                <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
                  {QUICK.map(c=>(
                    <motion.button key={c.l} whileTap={{scale:0.96}} onClick={()=>send(c.m)}
                      style={{padding:'9px 16px',borderRadius:20,background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',color:'var(--text2)',fontSize:13,cursor:'pointer',transition:'all 0.15s'}}
                      onMouseEnter={e=>{(e.target as any).style.background='rgba(255,26,136,0.08)';(e.target as any).style.borderColor='rgba(255,26,136,0.25)'}}
                      onMouseLeave={e=>{(e.target as any).style.background='rgba(255,255,255,0.05)';(e.target as any).style.borderColor='var(--border)'}}>
                      {c.e} {c.l}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {chat.messages.map((msg,idx)=>(
              <MsgRow key={msg.id} msg={msg} isNew={newIds.has(msg.id)} tts={prefs.ttsEnabled}
                onRegenerate={msg.role==='jarvis'&&idx===chat.messages.length-1?regenerate:undefined}/>
            ))}
            {thinking && <Typing/>}
            <div ref={bottomRef}/>
          </div>
        </div>

        {/* Scroll to bottom */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button className="scroll-btn" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              onClick={()=>bottomRef.current?.scrollIntoView({behavior:'smooth'})}>
              <ChevronDown size={14}/> Scroll to bottom
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="input-area">
          <div className="input-inner">
            <div className="input-box" style={{position:'relative'}}>
              {/* Attach popup */}
              <AnimatePresence>
                {showAttach && (
                  <AttachMenu
                    onCamera={()=>cameraRef.current?.click()}
                    onGallery={()=>galleryRef.current?.click()}
                    onPDF={()=>pdfRef.current?.click()}
                    onClose={()=>setShowAttach(false)}
                  />
                )}
              </AnimatePresence>

              <div className="input-main">
                <textarea ref={taRef} className="chat-input" value={input} rows={1}
                  placeholder={webSearch?'Web search ON — kuch bhi pucho...':'Message JARVIS...  ( / for commands )'}
                  onChange={e=>{
                    setInput(e.target.value)
                    e.target.style.height='auto'
                    e.target.style.height=Math.min(e.target.scrollHeight,160)+'px'
                  }}
                  onKeyDown={e=>{
                    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}
                    if(e.key==='/'&&!input) setShowCmd(true)
                    if(e.key==='Escape') setShowAttach(false)
                  }}
                />
                {thinking
                  ? <motion.button whileTap={{scale:0.9}} onClick={stop}
                      style={{width:34,height:34,borderRadius:10,border:'1px solid var(--border)',background:'rgba(255,255,255,0.05)',color:'var(--text)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <Square size={14}/>
                    </motion.button>
                  : <motion.button whileTap={{scale:0.9}} onClick={()=>send()} disabled={!input.trim()} className="send-btn">
                      <Send size={15}/>
                    </motion.button>
                }
              </div>

              {/* Toolbar */}
              <div className="input-toolbar">
                <button className="toolbar-btn" onClick={()=>setShowAttach(v=>!v)} title="Attach">
                  <Plus size={14}/>
                  <span>Attach</span>
                </button>
                <button className={`toolbar-btn${webSearch?' on':''}`} onClick={()=>setWebSearch(v=>!v)}>
                  <Globe size={13}/>
                  <span>{webSearch?'Search ON':'Web Search'}</span>
                </button>
                <button className="toolbar-btn" onClick={startVoice}>
                  {listening?<SoundWave isActive bars={8} height={14}/>:<Mic size={13}/>}
                  <span>{listening?'Listening...':'Voice'}</span>
                </button>
                <div className="toolbar-right">
                  <span style={{fontSize:10,color:'var(--text3)'}}>
                    {input.length>0?`${input.length} chars`:'Shift+Enter = new line'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools panel */}
      <AnimatePresence>
        {showTools && (
          <motion.div initial={{width:0,opacity:0}} animate={{width:isMobile?'100%':290,opacity:1}}
            exit={{width:0,opacity:0}} transition={{type:'spring',damping:28}}
            style={{position:isMobile?'fixed':undefined,right:0,top:0,bottom:0,zIndex:isMobile?300:1,overflow:'hidden',flexShrink:0}}>
            <ToolsPanel onClose={()=>setShowTools(false)}/>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={showCmd} onClose={()=>setShowCmd(false)} onAction={handleCmd}/>
      <SmartSettings isOpen={showSettings} onClose={()=>setShowSettings(false)}/>
    </div>
  )
}
