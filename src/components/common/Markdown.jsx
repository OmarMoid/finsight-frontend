// Markdown renderer shared by every page that shows long-form or AI text.
//
// Dependency-free and deliberately small, but it covers what the models
// actually emit: #–#### headings, lists, pipe tables, code, quotes, rules,
// bold/italic/inline code — and LaTeX. Models love `\[ \frac{a}{b} \]`, which
// rendered verbatim is unreadable, so math is converted to plain typography
// (a ÷ b, ×, ≈, real sub/superscripts) rather than shown as source.

import { Fragment } from 'react'

// ── LaTeX → readable text ───────────────────────────────────────────────────

const TEX_SYMBOLS = {
  times: '×', cdot: '·', div: '÷', pm: '±', mp: '∓',
  le: '≤', leq: '≤', ge: '≥', geq: '≥', neq: '≠', ne: '≠', approx: '≈', sim: '~', equiv: '≡',
  to: '→', rightarrow: '→', Rightarrow: '⇒', leftarrow: '←', implies: '⇒',
  infty: '∞', sum: 'Σ', prod: 'Π', partial: '∂', propto: '∝',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', epsilon: 'ε', theta: 'θ',
  lambda: 'λ', mu: 'μ', pi: 'π', rho: 'ρ', sigma: 'σ', Sigma: 'Σ', tau: 'τ', phi: 'φ', omega: 'ω',
  ldots: '…', cdots: '…', dots: '…', '%': '%', '$': '$', '&': '&', '#': '#', _: '_',
  ',': ' ', ';': ' ', ':': ' ', '!': '', quad: '  ', qquad: '   ', ' ': ' ',
  left: '', right: '', big: '', Big: '', bigl: '', bigr: '', Bigl: '', Bigr: '', displaystyle: '',
}
const TEX_TEXT_WRAPPERS = new Set(['text', 'mathrm', 'mathbf', 'mathit', 'textbf', 'textit', 'operatorname', 'mbox', 'boxed'])

// Reads a {…} group (or a single token) starting at i; returns [content, nextIndex].
function readGroup(s, i) {
  while (s[i] === ' ') i++
  if (s[i] !== '{') return [s[i] ?? '', i + 1]
  let depth = 0
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') depth++
    else if (s[j] === '}' && --depth === 0) return [s.slice(i + 1, j), j + 1]
  }
  return [s.slice(i + 1), s.length]
}

// Only operators outside any (…) group force brackets: (1+WACC)^t stays bare.
const needsParens = (x) => {
  let top = x.trim()
  while (/\([^()]*\)/.test(top)) top = top.replace(/\([^()]*\)/g, '')
  return /[\s+\-−×·÷/]/.test(top.replace(/[\^_]\{?[\w.]+\}?/g, ''))
}
const wrap = (x) => (needsParens(x) ? `(${x.trim()})` : x.trim())

// Flattens commands to plain Unicode, leaving ^ and _ for texNodes to lift.
export function texToText(src) {
  let out = ''
  for (let i = 0; i < src.length;) {
    const c = src[i]
    if (c !== '\\') { out += c; i++; continue }
    const m = src.slice(i + 1).match(/^([A-Za-z]+|.)/)
    if (!m) { i++; continue }
    const name = m[1]
    i += 1 + name.length
    if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
      const [a, i2] = readGroup(src, i)
      const [b, i3] = readGroup(src, i2)
      out += `${wrap(texToText(a))} ÷ ${wrap(texToText(b))}`
      i = i3
    } else if (name === 'sqrt') {
      const [a, i2] = readGroup(src, i)
      out += `√(${texToText(a)})`
      i = i2
    } else if (TEX_TEXT_WRAPPERS.has(name)) {
      const [a, i2] = readGroup(src, i)
      out += texToText(a)
      i = i2
    } else if (name in TEX_SYMBOLS) {
      out += TEX_SYMBOLS[name]
    } else {
      out += name // unknown command: keep the word, drop the backslash
    }
  }
  return out
}

// Turns ^x / ^{…} and _x / _{…} into real <sup>/<sub>; strips stray braces.
// In prose (`math` false) an underscore only subscripts after a capital or
// digit and before a short token — FCFF_n, PV_TV, V_0 — so ordinary
// identifiers like net_debt are left alone.
function scripts(s, math, keyBase) {
  const nodes = []
  let buf = ''
  const push = () => { if (buf) { nodes.push(buf.replace(/[{}]/g, '')); buf = '' } }
  for (let i = 0; i < s.length;) {
    const c = s[i]
    const isSup = c === '^'
    const next = s[i + 1]
    const isSub = c === '_' && (math || (/[A-Z0-9]/.test(s[i - 1] || '') && /^(\{[^}]{1,12}\}|[A-Za-z0-9]{1,4}\b)/.test(s.slice(i + 1))))
    if ((isSup || isSub) && next && (next === '{' || /[\w(+\-−]/.test(next))) {
      let content
      let end
      if (next === '{') [content, end] = readGroup(s, i + 1)
      else if (next === '(') {
        const close = s.indexOf(')', i + 1)
        end = close === -1 ? s.length : close + 1
        content = s.slice(i + 1, end)
      } else {
        const m = s.slice(i + 1).match(/^[+\-−]?[A-Za-z0-9]+(\.[0-9]+)?/)
        content = m ? m[0] : next
        end = i + 1 + content.length
      }
      push()
      const Tag = isSup ? 'sup' : 'sub'
      nodes.push(<Tag key={`${keyBase}-${i}`}>{content.replace(/[{}]/g, '')}</Tag>)
      i = end
    } else {
      buf += c
      i++
    }
  }
  push()
  return nodes
}

function MathExpr({ tex, block }) {
  if (!block) return <span className="md-math-inline">{scripts(texToText(tex.trim()), true, 'm')}</span>
  // A multi-line derivation keeps its lines (and their = alignment) apart.
  const lines = tex.split('\n').filter((l) => l.trim())
  return (
    <div className={`md-math${lines.length > 1 ? ' is-multi' : ''}`}>
      {lines.map((l, i) => <div key={i}>{scripts(texToText(l.trimEnd()).replace(/ - /g, ' − '), true, `m${i}`)}</div>)}
    </div>
  )
}

// An equation in backticks (`PV = CF / (1 + r)^t`) is maths, not code.
const isFormula = (x) => /[=≈]/.test(x) && !/==|=>|[;{}"']|\b(def|const|let|var|return|function)\b/.test(x) && /^[\w\s()+\-*/^=.,%≈×÷−Δ·_&]+$/.test(x)
const toMathText = (x) => x.replace(/\s\*\s|\*/g, ' × ').replace(/ - /g, ' − ').replace(/\s+/g, ' ')

// ── inline ──────────────────────────────────────────────────────────────────

// Plain prose: catch bare LaTeX commands, ^ powers and FCFF_n-style subscripts.
// Unicode subscript brackets (FCFF₍2029₎) are folded into a real <sub> too.
function plain(s, key) {
  const norm = s.replace(/₍([^₎]*)₎/g, '_{$1}')
  if (!/[\\^_]/.test(norm)) return s
  return scripts(texToText(norm), false, key)
}

export function inline(s) {
  const parts = s.split(/(\\\(.+?\\\)|\$\$.+?\$\$|\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g)
  return parts.map((p, i) => {
    if (!p) return null
    if (p.startsWith('\\(') && p.endsWith('\\)')) return <MathExpr key={i} tex={p.slice(2, -2)} />
    if (p.startsWith('$$') && p.endsWith('$$') && p.length > 4) return <MathExpr key={i} tex={p.slice(2, -2)} />
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <strong key={i} className="font-semibold text-[var(--text-primary)]">{inline(p.slice(2, -2))}</strong>
    if (p.startsWith('`') && p.endsWith('`') && p.length > 2) {
      const body = p.slice(1, -1)
      return isFormula(body) ? <MathExpr key={i} tex={toMathText(body)} /> : <code key={i} className="md-code">{body}</code>
    }
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{inline(p.slice(1, -1))}</em>
    return <Fragment key={i}>{plain(p, i)}</Fragment>
  })
}

// ── blocks ──────────────────────────────────────────────────────────────────

const splitRow = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
const isTableSep = (line) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line.trim())

export function parseBlocks(text) {
  const lines = (text || '').replace(/\r/g, '').split('\n')
  const blocks = []
  let para = []
  const flushPara = () => {
    if (para.length) { blocks.push({ type: 'p', lines: para }); para = [] }
  }
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()

    // Display math: \[ … \] or $$ … $$, on one line or spread across several.
    const open = t.startsWith('\\[') ? '\\]' : t.startsWith('$$') && !/^\$\$.+\$\$$/.test(t) ? '$$' : null
    if (open || /^\$\$.+\$\$$/.test(t)) {
      flushPara()
      if (!open) { blocks.push({ type: 'math', text: t.slice(2, -2) }); continue }
      let body = t.slice(2)
      if (body.includes(open)) {
        blocks.push({ type: 'math', text: body.slice(0, body.indexOf(open)) })
        continue
      }
      const acc = body ? [body] : []
      i++
      while (i < lines.length && !lines[i].includes(open)) acc.push(lines[i++].trim())
      if (i < lines.length) acc.push(lines[i].slice(0, lines[i].indexOf(open)).trim())
      blocks.push({ type: 'math', text: acc.filter(Boolean).join(' ') })
      continue
    }

    if (t.startsWith('```')) {
      flushPara()
      const lang = t.slice(3).trim()
      const code = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++])
      // Models often fence formulas to keep them on one line. An untagged
      // fence where every line is an equation is maths, not code.
      const filled = code.filter((l) => l.trim())
      const isFormula = !lang && filled.length > 0 && filled.every((l) => /[=≈]/.test(l) && !/[;{}]|=>|==|\b(def|const|let|var|return|import|function)\b/.test(l))
      blocks.push({ type: isFormula ? 'math' : 'code', text: code.join('\n') })
    } else if (/^#{1,6}\s/.test(t)) {
      flushPara()
      const level = t.match(/^#+/)[0].length
      blocks.push({ type: 'h', level, text: t.replace(/^#+\s*/, '').replace(/\s#+$/, '').replace(/\*\*/g, '') })
    } else if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) {
      flushPara()
      blocks.push({ type: 'hr' })
    } else if (t.startsWith('|')) {
      flushPara()
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].trim()
        if (!isTableSep(row)) rows.push(splitRow(row))
        i++
      }
      i--
      blocks.push({ type: 'table', rows })
    } else if (/^([-*•]|\d+[.)])\s+/.test(t)) {
      flushPara()
      const ordered = /^\d/.test(t)
      const items = []
      while (i < lines.length && /^\s*([-*•]|\d+[.)])\s+/.test(lines[i])) {
        const l = lines[i]
        const indent = l.match(/^\s*/)[0].length
        items.push({ text: l.trim().replace(/^([-*•]|\d+[.)])\s+/, ''), nested: indent >= 2 })
        i++
      }
      i--
      blocks.push({ type: ordered ? 'ol' : 'ul', items })
    } else if (t.startsWith('>')) {
      flushPara()
      blocks.push({ type: 'quote', text: t.replace(/^>\s?/, '') })
    } else if (t === '') {
      flushPara()
    } else {
      para.push(t)
    }
  }
  flushPara()
  return blocks
}

// A numeric-looking cell right-aligns so columns of figures line up.
const isNumeric = (c) => /^[\s(−\-+]*[A-Z]{0,2}\$?[\d.,]+\s*(%|x|×|bn|m|k|B|M|K)?\)?\s*$/.test(c)

export function Block({ b }) {
  switch (b.type) {
    case 'h':
      if (b.level === 1) return <h2 className="md-h1">{inline(b.text)}</h2>
      if (b.level === 2) return <h3 className="md-h2">{inline(b.text)}</h3>
      return <h4 className="md-h3">{inline(b.text)}</h4>
    case 'hr':
      return <hr className="md-hr" />
    case 'math':
      return <MathExpr tex={b.text} block />
    case 'code':
      return <pre className="md-pre"><code>{b.text}</code></pre>
    case 'quote':
      return <blockquote className="md-quote">{inline(b.text)}</blockquote>
    case 'table': {
      const [head = [], ...body] = b.rows
      const numericCol = head.map((_, ci) => body.length > 0 && body.every((r) => !r[ci] || isNumeric(r[ci])))
      return (
        <div className="md-table-wrap">
          <table className="md-table">
            <thead><tr>{head.map((c, i) => <th key={i} className={numericCol[i] ? 'is-num' : undefined}>{inline(c)}</th>)}</tr></thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{head.map((_, ci) => <td key={ci} className={numericCol[ci] ? 'is-num' : undefined}>{inline(r[ci] ?? '')}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    case 'ul':
    case 'ol': {
      let n = 0
      return (
        <ul className="md-list">
          {b.items.map((it, i) => {
            if (!it.nested) n++
            return (
              <li key={i} style={{ paddingLeft: it.nested ? 20 : 0 }}>
                <span className="md-marker" style={{ minWidth: b.type === 'ol' && !it.nested ? 18 : 10 }}>
                  {b.type === 'ol' && !it.nested ? `${n}.` : '•'}
                </span>
                <span className="md-text">{inline(it.text)}</span>
              </li>
            )
          })}
        </ul>
      )
    }
    default:
      // Single newlines are kept: models put one formula or figure per line
      // and expect them to stay apart, as any chat UI would show them.
      return (
        <p className="md-text md-p">
          {b.lines.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{inline(l)}</Fragment>)}
        </p>
      )
  }
}

// `sections` lets a caller restyle specific ## sections by title, e.g. Guru
// gives its RECOMMENDATION a callout and lets the DISCLAIMER recede.
export default function Markdown({ text, sections, className = '' }) {
  const blocks = parseBlocks(text)
  if (!sections) {
    return <div className={`md ${className}`}>{blocks.map((b, i) => <Block key={i} b={b} />)}</div>
  }
  const groups = []
  let current = { cls: null, blocks: [] }
  for (const b of blocks) {
    if (b.type === 'h' && b.level <= 2) {
      const title = b.text.toUpperCase()
      const match = Object.keys(sections).find((k) => title.includes(k))
      groups.push(current)
      current = { cls: match ? sections[match] : null, blocks: [b] }
    } else {
      current.blocks.push(b)
    }
  }
  groups.push(current)
  return (
    <div className={`md ${className}`}>
      {groups.map((g, gi) => {
        if (!g.blocks.length) return null
        const inner = g.blocks.map((b, bi) => <Block key={bi} b={b} />)
        return g.cls ? <div key={gi} className={g.cls}>{inner}</div> : <Fragment key={gi}>{inner}</Fragment>
      })}
    </div>
  )
}
