// Suspense Image
// http://localhost:3000/isolated/exercise/05.js

/*
problem we're getting is we're blocking the data when we're waiting forthe imgs to load.
so when debugging we found on url response we're getting the img name is also the pokemon name
we can update the img fetching and also the data will not have to wait 

we can check the real backend request and response with -  window.useRealAPI = true;
and we can see the req and response in the network tab.

the soln is we can update the createPokemonResource func here for this extra credit
*/

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  //5-2-b- import function for fetchign the pokemon img name
  getImageUrlForPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// ❗❗❗❗
// 🦉 On this one, make sure that you UNCHECK the "Disable cache" checkbox
// in your DevTools "Network Tab". We're relying on that cache for this
// approach to work!
// ❗❗❗❗

//5-2-e- don't need this function and cacheResouce for img

// function Img({src,alt,...props}){
//   let imgSrcResource = imgSrcResourceCache[src];
//   if(!imgSrcResource){ 
//     imgSrcResource = createResource(preloadImage(src));
//     imgSrcResourceCache[src] = imgSrcResource
//   }

//   return <img src={imgSrcResource.read()} alt={alt} {...props} />
// }

// const imgSrcResourceCache = {} 

function preloadImage(src){
  return new Promise(resolve =>{
    const img = document.createElement('img')
    img.src = src;
    img.onload = () => resolve(src);
  })
}


function PokemonInfo({pokemonResource}) {
    //5-2-c- update it as it is now an obj returned by function
//   const pokemon = pokemonResource.read()
    const pokemon = pokemonResource.data.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
          {/* //5-2-d- update this also */}
        {/* <Img src={pokemon.image} alt={pokemon.name} /> */}
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
// 5-2-a- update this method 
function createPokemonResource(pokemonName) {
//   return createResource(fetchPokemon(pokemonName))
    const data = createResource(fetchPokemon(pokemonName))
    const image = createResource(preloadImage(getImageUrlForPokemon(pokemonName)))
    return {data,image};
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
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
