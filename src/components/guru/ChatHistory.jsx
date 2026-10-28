// Guru's conversation history: a side sheet listing every saved chat,
// grouped by recency, with search, rename and delete. Chats themselves live
// in the store (guruChats) and persist across reloads and sign-ins.

import { useState, useMemo, useEffect, useRef } from 'react'
import { X, Search, Pencil, Trash2, Check, MessageSquare, SquarePen } from 'lucide-react'
import useStore from '../../store/useStore'

const DAY = 86400000

function groupLabel(ts) {
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  if (ts >= startOfToday) return 'Today'
  if (ts >= startOfToday - DAY) return 'Yesterday'
  if (ts >= startOfToday - 7 * DAY) return 'Previous 7 days'
  if (ts >= startOfToday - 30 * DAY) return 'Previous 30 days'
  return 'Older'
}

function timeLabel(ts) {
  const d = new Date(ts)
  return Date.now() - ts < DAY
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

export default function ChatHistory({ open, onClose, disabled }) {
  const chats = useStore((s) => s.guruChats)
  const activeId = useStore((s) => s.activeGuruChatId)
  const openChat = useStore((s) => s.openGuruChat)
  const newChat = useStore((s) => s.newGuruChat)
  const renameChat = useStore((s) => s.renameGuruChat)
  const deleteChat = useStore((s) => s.deleteGuruChat)

  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const editRef = useRef(null)

  useEffect(() => { if (editing) editRef.current?.select() }, [editing])
  useEffect(() => { if (!open) { setEditing(null); setQuery('') } }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape' && !editing) onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, editing, onClose])

  // Search matches titles and message text, so a chat can be found by
  // something said inside it, not only by its opening question.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = [...chats]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .filter((c) => !q || c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content?.toLowerCase().includes(q)))
    const out = []
    for (const c of list) {
      const label = groupLabel(c.updatedAt)
      const g = out[out.length - 1]
      if (g?.label === label) g.chats.push(c)
      else out.push({ label, chats: [c] })
    }
    return out
  }, [chats, query])

  if (!open) return null

  const commitRename = () => {
    const title = draft.trim()
    if (editing && title) renameChat(editing, title.slice(0, 80))
    setEditing(null)
  }
  const remove = (c) => {
    if (window.confirm(`Delete “${c.title}”? This can’t be undone.`)) deleteChat(c.id)
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="chat-history" role="dialog" aria-label="Chat history">
        <div className="flex items-center justify-between gap-2 p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-semibold text-[var(--text-primary)]">Chat history</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { newChat(); onClose() }}
              disabled={disabled}
              className="btn"
              title="Start a new chat"
            >
              <SquarePen size={14} /> New chat
            </button>
            <button onClick={onClose} className="guru-action" aria-label="Close"><X size={18} /></button>
          </div>
        </div>

        {chats.length > 0 && (
          <div className="px-4 pt-3">
            <div className="chat-search">
              <Search size={14} aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chats"
                aria-label="Search chats"
              />
            </div>
          </div>
        )}

        <div className="p-2 pb-6">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center text-center px-6 py-12">
              <MessageSquare size={22} style={{ color: 'var(--text-muted)' }} />
              <p className="mt-3 text-sm text-[var(--text-secondary)]">No chats yet</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Every conversation with Guru is saved here automatically.</p>
            </div>
          ) : groups.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">No chats match “{query}”.</p>
          ) : groups.map((g) => (
            <div key={g.label} className="mt-2">
              <div className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{g.label}</div>
              {g.chats.map((c) => {
                const active = c.id === activeId
                const count = c.messages.filter((m) => m.role === 'user').length
                return editing === c.id ? (
                  <form
                    key={c.id}
                    className="chat-row is-editing"
                    onSubmit={(e) => { e.preventDefault(); commitRename() }}
                  >
                    <input
                      ref={editRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setEditing(null) } }}
                      className="chat-rename"
                      aria-label="Chat name"
                      maxLength={80}
                    />
                    <button type="submit" className="guru-action" aria-label="Save name"><Check size={14} /></button>
                  </form>
                ) : (
                  <div key={c.id} className={`chat-row${active ? ' is-active' : ''}`}>
                    <button
                      className="chat-open"
                      disabled={disabled && !active}
                      onClick={() => { openChat(c.id); onClose() }}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="block truncate text-sm text-[var(--text-primary)]">{c.title}</span>
                      <span className="block text-2xs text-[var(--text-muted)]">
                        {timeLabel(c.updatedAt)} · {count} {count === 1 ? 'question' : 'questions'}
                      </span>
                    </button>
                    <div className="chat-row-actions">
                      <button onClick={() => { setDraft(c.title); setEditing(c.id) }} className="guru-action" aria-label={`Rename ${c.title}`} title="Rename"><Pencil size={13} /></button>
                      <button onClick={() => remove(c)} disabled={disabled && active} className="guru-action" aria-label={`Delete ${c.title}`} title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .chat-history {
          position: fixed; top: 0; left: 0; height: 100%; z-index: 61;
          width: 100%; overflow-y: auto;
          background: var(--bg-card);
          border-right: 1px solid var(--border);
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          animation: chatSlide 0.18s ease-out;
        }
        @media (min-width: 640px) { .chat-history { width: 360px; } }
        @keyframes chatSlide { from { transform: translateX(-12px); opacity: 0; } to { transform: none; opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .chat-history { animation: none; } }
        .chat-search {
          display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 10px;
          border-radius: 8px; background: var(--bg-input); border: 1px solid var(--border);
          color: var(--text-muted);
        }
        .chat-search:focus-within { border-color: var(--accent); }
        .chat-search input {
          flex: 1; min-width: 0; background: transparent; border: 0; outline: none;
          font-size: 16px; color: var(--text-primary);
        }
        @media (min-width: 640px) { .chat-search input { font-size: 0.8125rem; } }
        .chat-row {
          display: flex; align-items: center; gap: 4px; padding-right: 4px;
          border-radius: 8px; transition: background 0.12s ease;
        }
        .chat-row:hover, .chat-row.is-editing { background: var(--bg-card-hover); }
        .chat-row.is-active { background: color-mix(in srgb, var(--accent) 12%, transparent); }
        .chat-row.is-active .chat-open > span:first-child { color: var(--accent); font-weight: 500; }
        .chat-open { flex: 1; min-width: 0; text-align: left; padding: 8px 10px; }
        .chat-open:disabled { opacity: 0.5; cursor: not-allowed; }
        /* Row actions appear on hover, but stay visible on touch screens,
           which have no hover to reveal them with. */
        .chat-row-actions { display: flex; opacity: 1; }
        @media (hover: hover) {
          .chat-row-actions { opacity: 0; transition: opacity 0.12s ease; }
          .chat-row:hover .chat-row-actions, .chat-row:focus-within .chat-row-actions { opacity: 1; }
        }
        .chat-rename {
          flex: 1; min-width: 0; margin: 4px 0 4px 4px; height: 34px; padding: 0 8px;
          border-radius: 6px; outline: none; font-size: 16px;
          background: var(--bg-input); border: 1px solid var(--accent); color: var(--text-primary);
        }
        @media (min-width: 640px) { .chat-rename { font-size: 0.875rem; } }
      `}</style>
    </>
  )
}
