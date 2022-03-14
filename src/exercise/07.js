// Coordinate Suspending components with SuspenseList with their sequecnce as you planned
// http://localhost:3000/isolated/exercise/07.js

import * as React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import {createResource} from '../utils'
import {fetchUser, PokemonForm, PokemonErrorBoundary} from '../pokemon'

// 💰 this delay function just allows us to make a promise take longer to resolve
// so we can easily play around with the loading time of our code.
const delay = time => promiseResult =>
  new Promise(resolve => setTimeout(() => resolve(promiseResult), time))

// 🐨 feel free to play around with the delay timings.
const NavBar = React.lazy(() =>
  import('../suspense-list/nav-bar').then(delay(500)),
)
const LeftNav = React.lazy(() =>
  import('../suspense-list/left-nav').then(delay(2000)),
)
const MainContent = React.lazy(() =>
  import('../suspense-list/main-content').then(delay(1500)),
)
const RightNav = React.lazy(() =>
  import('../suspense-list/right-nav').then(delay(1000)),
)

const fallback = (
  <div className={cn.spinnerContainer}>
    <Spinner />
  </div>
)
const SUSPENSE_CONFIG = {timeoutMs: 4000}

function App() {
  const [startTransition] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(pokemonName) {
    startTransition(() => {
      setPokemonResource(createResource(fetchUser(pokemonName)))
    })
  }

  if (!pokemonResource) {
    return (
      <div className="pokemon-info-app">
        <div
          className={`${cn.root} totally-centered`}
          style={{height: '100vh'}}
        >
          <PokemonForm onSubmit={handleSubmit} />
        </div>
      </div>
    )
  }

  function handleReset() {
    setPokemonResource(null)
  }

  // 7-1-a- 🐨 Use React.SuspenseList throughout these Suspending components to make
  // them load in a way that is not jarring to the user.
  // 💰 there's not really a specifically "right" answer for this.
  return (
    <div className="pokemon-info-app">
      <div className={cn.root}>
        <PokemonErrorBoundary
          onReset={handleReset}
          resetKeys={[pokemonResource]}
        >
          {/* revealOrder determines the order - 
          forwards and backwards works on direct children of suspence
          'together'  - all components will wait for the last comp to load and then render them all at once
          'forwards' - all will load one by one depending on their loading spoeed and time
          'backwards'  - will reveal the last comp first . ex - will be chat app where the last chat is displayed first
          
          tail  - decides what the loading should do
          hidden - will remove the loader and comp will load without it
          collapsed - will do the loading comp for the boundary components
          */}
          <React.SuspenseList revealOrder='forwards' tail='collapsed'>
              <React.Suspense fallback={fallback}>
                <NavBar pokemonResource={pokemonResource} />
              </React.Suspense>
              <div className={cn.mainContentArea}>
              <React.SuspenseList revealOrder='forwards'>
                  <React.Suspense fallback={fallback}>
                    <LeftNav />
                  </React.Suspense>
                  <React.SuspenseList revealOrder='forwards'>
                      <React.Suspense fallback={fallback}>
                        <MainContent pokemonResource={pokemonResource} />
                      </React.Suspense>
                      <React.Suspense fallback={fallback}>
                        <RightNav pokemonResource={pokemonResource} />
                      </React.Suspense>
                  </React.SuspenseList>`
              </React.SuspenseList>
              </div>
          </React.SuspenseList>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
