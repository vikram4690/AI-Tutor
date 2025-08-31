// import React from 'react'

// const faceStyles = {
//   container: {
//     display: 'flex', alignItems: 'center', gap: 16
//   },
//   face: (emotion) => ({
//     width: 140, height: 140, borderRadius: '50%',
//     background: '#f5f5f5', border: '2px solid #ddd',
//     display: 'grid', placeItems: 'center',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//     position: 'relative',
//     transition: 'transform 200ms ease',
//     transform: emotion === 'happy' ? 'scale(1.05)' : 'scale(1)',
//   }),
//   eyes: { position: 'absolute', top: 46, left: 0, right: 0, display: 'flex', justifyContent: 'space-around' },
//   eye: { width: 14, height: 14, borderRadius: '50%', background: '#333' },
//   mouth: (speaking) => ({
//     position: 'absolute', bottom: 36, left: 0, right: 0, margin: '0 auto',
//     width: speaking ? 46 : 28, height: speaking ? 20 : 8,
//     borderRadius: 20, background: '#333', transition: 'all 120ms ease'
//   }),
//   status: { fontSize: 14, opacity: 0.7 }
// }

// export default function Mascot({ emotion = 'explaining', speaking = false, listening = false, onMic }) {
//   const mood = {
//     happy: '😀',
//     thinking: '🤔',
//     explaining: '🧠'
//   }[emotion] || '🧠'

//   return (
//     <div style={faceStyles.container}>
//       <div style={faceStyles.face(emotion)} aria-label={`mascot ${emotion}`}>
//         <div style={faceStyles.eyes}>
//           <div style={faceStyles.eye}></div>
//           <div style={faceStyles.eye}></div>
//         </div>
//         <div style={faceStyles.mouth(speaking)}></div>
//         <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 22 }}>{mood}</div>
//       </div>
//       <div>
//         <div style={faceStyles.status}>
//           Emotion: <b>{emotion}</b> • {speaking ? '🔊 speaking' : listening ? '🎙️ listening' : 'idle'}
//         </div>
//         <div style={{ marginTop: 8 }}>
//           <button onClick={onMic} style={{ padding: '8px 12px' }}>{listening ? 'Stop' : '🎤 Start STT'}</button>
//         </div>
//       </div>
//     </div>
//   )
// }



import React from 'react'

const faceStyles = {
  container: {
    display: 'flex', 
    alignItems: 'center', 
    gap: 24,
    padding: '20px',
    background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
  },
  face: (emotion) => ({
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: '#ffffff',
    border: '3px solid #e0e0e0',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    position: 'relative',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: emotion === 'happy' ? 'scale(1.08)' : 'scale(1)',
  }),
  eyes: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0 20px'
  },
  eye: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#222',
    transition: 'all 200ms ease'
  },
  mouth: (speaking) => ({
    position: 'absolute',
    bottom: 42,
    left: 0,
    right: 0,
    margin: '0 auto',
    width: speaking ? 50 : 30,
    height: speaking ? 24 : 10,
    borderRadius: 30,
    background: '#222',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }),
  status: {
    fontSize: 15,
    color: '#444',
    fontWeight: 500,
    marginBottom: 12
  },
  button: {
    padding: '10px 16px',
    background: '#007AFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
    ':hover': {
      background: '#0056b3',
      transform: 'translateY(-1px)'
    }
  }
}

export default function Mascot({ emotion = 'explaining', speaking = false, listening = false, onMic }) {
  const mood = {
    happy: '😊',
    thinking: '🤔',
    explaining: '🧠'
  }[emotion] || '🧠'

  return (
    <div style={faceStyles.container}>
      <div style={faceStyles.face(emotion)} aria-label={`mascot ${emotion}`}>
        <div style={faceStyles.eyes}>
          <div style={faceStyles.eye}></div>
          <div style={faceStyles.eye}></div>
        </div>
        <div style={faceStyles.mouth(speaking)}></div>
        <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 24 }}>{mood}</div>
      </div>
      <div>
        <div style={faceStyles.status}>
          Current state: <b>{emotion}</b> 
          <span style={{marginLeft: 8}}>
            {speaking ? '🔊 Speaking' : listening ? '🎙️ Listening' : '💭 Idle'}
          </span>
        </div>
        <div>
          <button 
            onClick={onMic} 
            style={faceStyles.button}
          >
            {listening ? '⏹️ Stop Recording' : '🎤 Start Recording'}
          </button>
        </div>
      </div>
    </div>
  )
}