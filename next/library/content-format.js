// A deliberately small, escaped reading format. Never renders raw HTML or remote embeds.
const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function inline(text) {
  const token = /(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;
  let out = '', cursor = 0;
  for (const match of text.matchAll(token)) {
    out += escape(text.slice(cursor, match.index));
    out += match[0].startsWith('`') ? `<code>${escape(match[0].slice(1,-1))}</code>` : `<strong>${escape(match[0].slice(2,-2))}</strong>`;
    cursor = match.index + match[0].length;
  }
  return out + escape(text.slice(cursor));
}
const tableCells = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(s => s.trim());
const tableRule = line => line.includes('|') && tableCells(line).every(s => /^:?-{3,}:?$/.test(s));
const special = line => /^\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|```|~~~|(?:-{3,}|\*{3,}|_{3,})\s*$)/.test(line);

export function renderReadableContent(value) {
  const lines = String(value ?? '').replace(/\r\n?/g,'\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const body = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i++]);
      if (i < lines.length) i++;
      blocks.push(`<pre><code>${escape(body.join('\n'))}</code></pre>`); continue;
    }
    const heading = line.match(/^\s*(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length + 2, 6);
      blocks.push(`<h${level}>${inline(heading[2])}</h${level}>`); i++; continue;
    }
    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { blocks.push('<hr>'); i++; continue; }
    if (i+1 < lines.length && line.includes('|') && tableRule(lines[i+1])) {
      const head = tableCells(line); i += 2;
      let rows = '';
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        rows += `<tr>${tableCells(lines[i++]).map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`;
      }
      blocks.push(`<div class="reading-table" role="region" aria-label="正文表格" tabindex="0"><table><thead><tr>${head.map(c=>`<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`); continue;
    }
    if (/^\s*>/.test(line)) {
      const quote = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) quote.push(inline(lines[i++].replace(/^\s*>\s?/,'')));
      blocks.push(`<blockquote>${quote.join('<br>')}</blockquote>`); continue;
    }
    const list = line.match(/^\s*([-*+]|\d+[.)])\s+(.+)$/);
    if (list) {
      const ordered = /^\d/.test(list[1]);
      const matcher = ordered ? /^\s*\d+[.)]\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/;
      const items = [];
      let match;
      while (i < lines.length && (match = lines[i].match(matcher))) { items.push(`<li>${inline(match[1])}</li>`); i++; }
      const tag = ordered ? 'ol' : 'ul';
      const start = ordered ? ` start="${Number.parseInt(list[1],10)}"` : '';
      blocks.push(`<${tag}${start}>${items.join('')}</${tag}>`); continue;
    }
    const para = [inline(line)]; i++;
    while (i < lines.length && lines[i].trim() && !special(lines[i]) && !(i+1 < lines.length && tableRule(lines[i+1]))) para.push(inline(lines[i++]));
    blocks.push(`<p>${para.join('<br>')}</p>`);
  }
  return blocks.join('\n');
}
