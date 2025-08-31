import React, { useState, useRef } from 'react'
import { postJSON, uploadAudio } from './api'
import Mascot from './mascot/Mascot.jsx'

function speak(text) {
  if (!('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(text)
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}

export default function App() {
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const [list, setList] = useState([])
  const [listening, setListening] = useState(false)
  const [emotion, setEmotion] = useState('explaining')
  const mediaRef = useRef(null)

  const send = async (msg) => {
    setList((l) => [...l, { role: 'user', text: msg }])
    try {
      const res = await postJSON('/chat', { session_id: sessionId, message: msg })
      setEmotion(res.emotion || 'explaining')
      setList((l) => [...l, { role: 'assistant', text: res.text }])
      speak(res.text)
    } catch (e) {
      setList((l) => [...l, { role: 'assistant', text: 'Error: ' + e.message }])
    }
  }

  const onMic = async () => {
    if (listening) {
      mediaRef.current?.stop()
      setListening(false)
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Mic not supported in this browser.')
      return
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const rec = new MediaRecorder(stream)
    const chunks = []
    rec.ondataavailable = (e) => chunks.push(e.data)
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      try {
        const { text } = await uploadAudio(blob)
        if (text?.trim()) await send(text.trim())
      } catch (e) {
        setList((l) => [...l, { role: 'assistant', text: 'STT error: ' + e.message }])
      }
    }
    rec.start()
    mediaRef.current = rec
    setListening(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const msg = e.target.q.value.trim()
    if (!msg) return
    e.target.q.value = ''
    await send(msg)
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>RAG Tutor Mascot</h1>
      <p style={{opacity:0.7}}>Local STT (backend Whisper) • Browser TTS • Emotion-aware avatar</p>

      <Mascot emotion={emotion} speaking={window.speechSynthesis?.speaking} listening={listening} onMic={onMic} />

      <div style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
        <form onSubmit={onSubmit}>
          <input name="q" placeholder="Ask something..." style={{ width: '80%', padding: 10, fontSize: 16 }} />
          <button type="submit" style={{ padding: '10px 16px', marginLeft: 8 }}>Send</button>
          <button type="button" onClick={onMic} style={{ padding: '10px 16px', marginLeft: 8 }}>
            {listening ? 'Stop Mic' : '🎤 Speak'}
          </button>
        </form>

        <div style={{ marginTop: 16 }}>
          {list.map((m, i) => (
            <div key={i} style={{ padding: '8px 0' }}>
              <b>{m.role === 'user' ? 'You' : 'Tutor'}:</b> {m.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
