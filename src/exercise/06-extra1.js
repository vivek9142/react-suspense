// Suspense with a custom hook
// http://localhost:3000/isolated/exercise/06.js


//refactoring this file

import * as React from 'react'
import {
//   fetchPokemon,
//   getImageUrlForPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
//   6-2-a- import usePokemonResouce
    usePokemonResource
} from '../pokemon'
// import {createResource, preloadImage} from '../utils'

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.data.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemonResource.image.read()} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

// 6-2-f - this also
// const SUSPENSE_CONFIG = {
//   timeoutMs: 4000,
//   busyDelayMs: 300,
//   busyMinDurationMs: 700,
// }

//6-2-d- this also
// const pokemonResourceCache = {}

// 6-2-c - get rid of this also 
// function getPokemonResource(name) {
//   const lowerName = name.toLowerCase()
//   let resource = pokemonResourceCache[lowerName]
//   if (!resource) {
//     resource = createPokemonResource(lowerName)
//     pokemonResourceCache[lowerName] = resource
//   }
//   return resource
// }

// 6-2-e- this also
// function createPokemonResource(pokemonName) {
//   const data = createResource(fetchPokemon(pokemonName))
//   const image = createResource(preloadImage(getImageUrlForPokemon(pokemonName)))
//   return {data, image}
// }

//6-2-b- get rid of these entirely
// function usePokemonResource(pokemonName){
//   const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
//   const [pokemonResource, setPokemonResource] = React.useState(null)

//   React.useEffect(() => {
//     if (!pokemonName) {
//       setPokemonResource(null)
//       return
//     }
//     startTransition(() => {
//       setPokemonResource(getPokemonResource(pokemonName))
//     })
//   }, [pokemonName, startTransition])

//   return [pokemonResource,isPending]

// }

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource,isPending] = usePokemonResource(pokemonName);

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
