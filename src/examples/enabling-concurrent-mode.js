// http://localhost:3000/isolated/examples/enabling-concurrent-mode.js

import * as React from 'react'
import ReactDOM from 'react-dom'

function App() {
  return <div>Hello React World!</div>
}

const rootEl = document.getElementById('root')

// the old way:
// ReactDOM.render(<App />, rootEl)


//to enable concurrent mode and new way
// the new way:
const root = ReactDOM.createRoot(rootEl)
root.render(<App />)

//if we want to unmount the root component from dom
// root.unmount();