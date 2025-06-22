import React from 'react'
export default function ErrorPage({errorCode}) {
  return (
    <div>
      <h1>{ errorCode } Error</h1>
    </div>
  )
}