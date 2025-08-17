/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import process from 'node:process'

const PRIMEVUE_ROOT = path.resolve(process.cwd(), 'node_modules/primevue')
const OUTPUT_DIR = path.resolve(process.cwd(), 'src/design/pt')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'primevue-pt.schema.d.ts')
const CACHE_DIR = path.join(OUTPUT_DIR, '.cache')
const HASH_FILE = path.join(CACHE_DIR, 'primevue-pt.types.hash')

const ensureDir = (p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

const walkDts = (dir) => {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'style') continue
      out.push(...walkDts(p))
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      out.push(p)
    }
  }
  return out
}

const parseInterfaces = (content) => {
  const result = []
  // Заголовочный JSDoc модуля (в начале файла) — для описания компонента
  const headerDocMatch = content.match(/^\s*\/\*\*[\s\S]*?\*\/\s*/)
  const fileHeaderDoc = headerDocMatch ? headerDocMatch[0] : ''
  const rx =
    /export\s+(?:declare\s+)?interface\s+(\w+PassThroughOptions)\s*(?:<[^>]*>)?\s*\{([\s\S]*?)\}/g
  let m
  while ((m = rx.exec(content))) {
    const ifaceName = m[1]
    const body = m[2]
    // Берем JSDoc только из заголовка файла (модульный комментарий)
    const ifaceDoc = fileHeaderDoc
    const keys = []
    const keyDocs = {}

    const lines = body.split('\n')
    let collecting = false
    let buf = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      // захват многострочного JSDoc
      if (!collecting && /\/\*\*/.test(line)) {
        collecting = true
        buf = [line]
        continue
      }
      if (collecting) {
        buf.push(line)
        if (/\*\//.test(line)) {
          collecting = false
          // не продолжаем, ключ будет на последующих строках
        }
        continue
      }
      const lm = line.match(/\s*(\w+)\s*\?\s*:/)
      if (!lm) continue
      const key = lm[1]
      if (/^(on\w+|hooks?)$/i.test(key)) {
        buf = []
        continue
      }
      keys.push(key)
      if (buf.length) {
        // сохраняем оригинальный jsdoc как есть
        keyDocs[key] = buf.join('\n')
        buf = []
      }
    }
    result.push({ ifaceName, keys, keyDocs, ifaceDoc })
  }
  return result
}

// Вставляем только оригинальный JSDoc из исходников PrimeVue.

const indentDoc = (doc, pad = '  ') =>
  doc
    .split('\n')
    .map((l) => pad + l.trim())
    .join('\n')

const toComponentName = (ifaceName) =>
  ifaceName.replace(/PassThroughOptions$/, '').toLowerCase()

const orderKeys = (keys) => {
  const priority = ['root', 'loadingIcon', 'icon', 'label']
  const set = new Set(keys)
  const ordered = []
  for (const k of priority) if (set.delete(k)) ordered.push(k)
  ordered.push(...Array.from(set).sort((a, b) => a.localeCompare(b)))
  return ordered
}

const buildTypes = (interfaces) => {
  const lines = []
  lines.push('export type PartAttrs = Record<string, any>;')
  lines.push('')

  const mapEntries = []

  for (const { ifaceName, keys, keyDocs = {} } of interfaces) {
    const comp = toComponentName(ifaceName)
    const k = keys.length ? Array.from(new Set(keys)) : ['root']
    const ordered = orderKeys(k)
    const typeName = `${comp[0].toUpperCase()}${comp.slice(1)}PT`
    lines.push(`export interface ${typeName} {`)
    for (const key of ordered) {
      const doc = keyDocs[key]
      if (doc) {
        lines.push(indentDoc(doc))
      }
      lines.push(`  ${key}?: PartAttrs;`)
    }
    lines.push('  [k: string]: PartAttrs | undefined;')
    lines.push('}')
    lines.push('')
    mapEntries.push({ comp, typeName })
  }

  // Быстрый доступ к интерфейсным JSDoc для вывода на уровне PTMap
  const compDocMap = new Map()
  for (const { ifaceName, ifaceDoc } of interfaces) {
    const comp = toComponentName(ifaceName)
    if (ifaceDoc) compDocMap.set(comp, ifaceDoc)
  }

  // Карта известных компонентов с JSDoc
  lines.push('export interface PTKnownMap {')
  for (const { comp, typeName } of mapEntries.sort((a, b) =>
    a.comp.localeCompare(b.comp),
  )) {
    const compDoc = compDocMap.get(comp)
    if (compDoc) lines.push(indentDoc(compDoc))
    lines.push(`  ${comp}?: ${typeName};`)
  }
  lines.push('}')
  lines.push('')
  // Совместимый тип со свободными ключами, но с качественными подсказками по известным
  lines.push(
    'export type PTMap = PTKnownMap & { [component: string]: Record<string, any> | undefined };',
  )
  lines.push('')
  return lines.join('\n')
}

const hashContent = (s) => crypto.createHash('sha256').update(s).digest('hex')

export const generatePrimeVuePTTypes = async ({
  primevueRoot = PRIMEVUE_ROOT,
  outFile = OUTPUT_FILE,
} = {}) => {
  const files = walkDts(primevueRoot)
  if (!files.length) return { written: false, reason: 'no_dts' }

  const interfaces = []
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      interfaces.push(...parseInterfaces(content))
    } catch {}
  }
  if (!interfaces.length) return { written: false, reason: 'no_interfaces' }

  const dts = buildTypes(interfaces)
  const nextHash = hashContent(dts)

  ensureDir(OUTPUT_DIR)
  ensureDir(CACHE_DIR)

  let prevHash = ''
  if (fs.existsSync(HASH_FILE)) {
    try {
      prevHash = fs.readFileSync(HASH_FILE, 'utf8').trim()
    } catch {}
  }

  if (prevHash === nextHash && fs.existsSync(OUTPUT_FILE)) {
    return { written: false, reason: 'unchanged' }
  }

  fs.writeFileSync(outFile, dts, 'utf8')
  fs.writeFileSync(HASH_FILE, nextHash, 'utf8')
  return { written: true }
}

// CLI режим
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePrimeVuePTTypes().then((r) => {
    if (r.written) process.stdout.write('primevue-pt.schema.d.ts generated\n')
  })
}
