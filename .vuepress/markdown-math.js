const katex = require('katex')

module.exports = md => {
  const render = (tex, displayMode) => katex.renderToString(tex, {
    displayMode,
    throwOnError: true,
    strict: 'ignore',
  })

  md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    const start = state.pos
    if (state.src[start] !== '$' || /\s|\$/.test(state.src[start + 1] || ' ')) return false
    let end = start + 1
    while ((end = state.src.indexOf('$', end)) !== -1) {
      let escapes = 0
      for (let i = end - 1; state.src[i] === '\\'; i--) escapes++
      if (escapes % 2 === 0) break
      end++
    }
    if (end === -1 || /\s/.test(state.src[end - 1]) || /\d/.test(state.src[end + 1] || '')) return false
    if (!silent) {
      const token = state.push('math_inline', 'math', 0)
      token.content = state.src.slice(start + 1, end)
    }
    state.pos = end + 1
    return true
  })

  md.block.ruler.before('fence', 'math_block', (state, start, end, silent) => {
    const line = n => state.src.slice(state.bMarks[n] + state.tShift[n], state.eMarks[n]).trim()
    if (line(start) !== '$$') return false
    let close = start + 1
    while (close < end && line(close) !== '$$') close++
    if (close === end) return false
    if (silent) return true
    const token = state.push('math_block', 'math', 0)
    token.block = true
    token.content = state.getLines(start + 1, close, state.blkIndent, false)
    token.map = [start, close + 1]
    state.line = close + 1
    return true
  })

  md.renderer.rules.math_inline = (tokens, i) => render(tokens[i].content, false)
  md.renderer.rules.math_block = (tokens, i) => render(tokens[i].content, true) + '\n'
}
