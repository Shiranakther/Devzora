import React from 'react'
import { Link } from 'react-router-dom'
export default function Notfound() {
  return (
    <div>
        <section
  style={{
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '4rem',
    backgroundColor: '#FAFAFA',
    color: '#1F2937', // Tailwind's gray-800
  }}
>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '1.25rem',
      paddingRight: '1.25rem',
      margin: '2rem auto',
    }}
  >
    <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
      <h2
        style={{
          marginBottom: '2rem',
          fontWeight: '800',
          fontSize: '9rem',
          color: '#9CA3AF', // Tailwind's gray-400
        }}
      >
        <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
          Error
        </span>
        404
      </h2>
      <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>
        Sorry, we couldn't find this page.
      </p>
      <p style={{ marginTop: '1rem', marginBottom: '2rem', color: '#4B5563' }}>
        But don't worry, you can find plenty of other things on our homepage.
      </p>
      <Link to="/">
  <p
    style={{
      padding: '0.75rem 2rem',
      fontWeight: '600',
      borderRadius: '0.375rem',
      backgroundColor: 'rgb(0, 123, 255)', // Tailwind's violet-600
      color: '#F9FAFB', // Tailwind's gray-50
      textDecoration: 'none',
      outline: 'none',
    }}
  >
    Back to Devzora homepage
  </p>
</Link>

    </div>
  </div>
</section>

      
    </div>
  )
}
