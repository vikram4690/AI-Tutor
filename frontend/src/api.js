const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const TOKEN = import.meta.env.VITE_API_KEY

export async function postJSON(path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (TOKEN && TOKEN !== 'change-me') headers['Authorization'] = `Bearer ${TOKEN}`
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`API ${res.status}: ${txt}`)
  }
  return res.json()
}

export async function uploadAudio(blob) {
  const headers = {}
  if (TOKEN && TOKEN !== 'change-me') headers['Authorization'] = `Bearer ${TOKEN}`
  const fd = new FormData()
  fd.append('file', blob, 'speech.webm')
  const res = await fetch(`${API_BASE}/stt`, { method: 'POST', headers, body: fd })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`API ${res.status}: ${txt}`)
  }
  return res.json()
}
