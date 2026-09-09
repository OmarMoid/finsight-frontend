// Saving a downloaded file, on both surfaces the app ships on.
//
// The browser path is the usual object-URL + <a download> click. That path
// silently does NOTHING inside the iOS Capacitor shell: WKWebView ignores the
// `download` attribute and refuses to navigate to a blob: URL, so the button
// appeared to work and no file ever arrived. On native we therefore write the
// bytes to the app's Documents directory with the Filesystem plugin and hand
// the resulting file:// URI to the iOS share sheet, which is what lets the user
// put it in Files, iCloud Drive, Mail, or open it straight in Numbers/Excel.

import { isNative } from './apiBase'

// FileReader gives us a `data:<mime>;base64,<payload>` URL; the Filesystem
// plugin wants just the payload.
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error || new Error('Could not read the file'))
    reader.onload = () => {
      const result = String(reader.result || '')
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.readAsDataURL(blob)
  })
}

function saveViaBrowser(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoking immediately can cut the download off in some browsers; one tick
  // is enough for the click to have been handed to the download manager.
  setTimeout(() => URL.revokeObjectURL(url), 10000)
  return { ok: true, mode: 'browser' }
}

async function saveViaNative(blob, filename) {
  const [{ Filesystem, Directory }, { Share }] = await Promise.all([
    import('@capacitor/filesystem'),
    import('@capacitor/share'),
  ])

  const data = await blobToBase64(blob)
  const written = await Filesystem.writeFile({
    path: filename,
    data,
    directory: Directory.Documents,
    recursive: true,
  })

  try {
    await Share.share({
      title: filename,
      text: filename,
      url: written.uri,
      dialogTitle: 'Save or open workbook',
    })
  } catch (err) {
    // Dismissing the share sheet rejects. The file is already on disk and
    // visible in Files → On My iPhone → FinSight, so that is not a failure.
    return { ok: true, mode: 'saved', uri: written.uri, shared: false }
  }
  return { ok: true, mode: 'shared', uri: written.uri, shared: true }
}

/**
 * Persist `blob` as `filename` in whichever way the current platform supports.
 * Resolves to { ok: true, mode } or { ok: false, message } — it never throws,
 * so callers can surface a message rather than wrap every call in try/catch.
 */
export async function saveBlob(blob, filename) {
  if (!blob) return { ok: false, message: 'Nothing to save - the file came back empty.' }
  try {
    return isNative() ? await saveViaNative(blob, filename) : saveViaBrowser(blob, filename)
  } catch (err) {
    return { ok: false, message: err?.message || 'Could not save the file to this device.' }
  }
}

// Human-readable confirmation for the surface the file actually landed on.
export function saveResultMessage(result, filename) {
  if (!result?.ok) return result?.message || 'Download failed.'
  if (result.mode === 'saved') return `Saved to Files → On My iPhone → FinSight → ${filename}`
  if (result.mode === 'shared') return `${filename} is ready to save or open.`
  return `Downloaded ${filename}.`
}
