// Suspense with a custom hook
// http://localhost:3000/isolated/exercise/06.js


//create a custome hook for this fetching feature.

import * as React from 'react'
import {
  fetchPokemon,
  getImageUrlForPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource, preloadImage} from '../utils'

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

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

const pokemonResourceCache = {}

function getPokemonResource(name) {
  const lowerName = name.toLowerCase()
  let resource = pokemonResourceCache[lowerName]
  if (!resource) {
    resource = createPokemonResource(lowerName)
    pokemonResourceCache[lowerName] = resource
  }
  return resource
}

function createPokemonResource(pokemonName) {
  const data = createResource(fetchPokemon(pokemonName))
  const image = createResource(preloadImage(getImageUrlForPokemon(pokemonName)))
  return {data, image}
}

//6-1-c- simply in creating custom hook , simply copy the lines from your comp to function
//then includethe var name labelledas red in the function param and return the values in yelow  as array or obj
function usePokemonResource(pokemonName){
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition])

  return [pokemonResource,isPending]

}
function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  // 6-1-a- 🐨 move these two lines to a custom hook called usePokemonResource
  // const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  // const [pokemonResource, setPokemonResource] = React.useState(null)
  // 🐨 call usePokemonResource with the pokemonName.
  //    It should return both the pokemonResource and isPending

  // 6-1-b- 🐨 move this useEffect call to your custom usePokemonResource hook
  // React.useEffect(() => {
  //   if (!pokemonName) {
  //     setPokemonResource(null)
  //     return
  //   }
  //   startTransition(() => {
  //     setPokemonResource(getPokemonResource(pokemonName))
  //   })
  // }, [pokemonName, startTransition])

  //6-1-d - use the custom hook made above
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
