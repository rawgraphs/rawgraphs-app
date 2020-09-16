import React from 'react'

export default function Paste({ userInput, setUserInput }) {
  return (
    <textarea
      value={userInput}
      onChange={(e) => {
        const str = e.target.value
        setUserInput(str)
      }}
      style={{
        backgroundColor: 'white',
        border: '1px solid lightgrey',
        borderRadius: 4,
        width: '100%',
        padding: '1rem',
        minHeight: '250px',
        height: '40vh',
      }}
    />
  )
}
