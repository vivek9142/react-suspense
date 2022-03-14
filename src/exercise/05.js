// // Suspense Image
// // http://localhost:3000/isolated/exercise/05.js

// /*
// problem we're getting is while switching between pokemon we're getting delay 
// inspite of getting the data we're getting the delay and the img we're gettin of previous pokemon
// while it is loading

// soln is we want to suspend the img as well while it is loaded.
// */

// import * as React from 'react'
// import {
//   fetchPokemon,
//   PokemonInfoFallback,
//   PokemonForm,
//   PokemonDataView,
//   PokemonErrorBoundary,
// } from '../pokemon'
// import {createResource} from '../utils'

// // ❗❗❗❗
// // 🦉 On this one, make sure that you UNCHECK the "Disable cache" checkbox
// // in your DevTools "Network Tab". We're relying on that cache for this
// // approach to work!
// // ❗❗❗❗

// // we need to make a place to store the resources outside of render so
// // 🐨 create "cache" object here.

// // 🐨 create an Img component that renders a regular <img /> and accepts a src
// // prop and forwards on any remaining props.

// // 🐨 The first thing you do in this component is check whether your
// // imgSrcResourceCache already has a resource for the given src prop. If it does
// // not, then you need to create one (💰 using createResource).
// // 🐨 Once you have the resource, then render the <img />.
// // 💰 Here's what rendering the <img /> should look like:
// // <img src={imgSrcResource.read()} {...props} />

// window.useRealAPI = true;

// // 5-1-b- 🐨 create an Img component that renders a regular <img /> and accepts a src
// // prop and forwards on any remaining props.
// function Img({src,alt,...props}){
//   let imgSrcResource = imgSrcResourceCache[src];
//   if(!imgSrcResource){ 
//     imgSrcResource = createResource(preloadImage(src));
//     imgSrcResourceCache[src] = imgSrcResource
//   }

//   return <img src={imgSrcResource.read()} alt={alt} {...props} />
// }

// //5-1-d  - in order to minimise the var creation on every re-renders we're creating cache obj
// const imgSrcResourceCache = {} 

// //5-1-c- async func for suspence resource
// function preloadImage(src){
//   return new Promise(resolve =>{
//     const img = document.createElement('img')
//     img.src = src;
//     img.onload = () => resolve(src);
//   })
// }


// function PokemonInfo({pokemonResource}) {
//   const pokemon = pokemonResource.read()
//   return (
//     <div>
//       <div className="pokemon-info__img-wrapper">
//         {/* 5-1-a- 🐨 swap this img for your new Img component */}
//         {/* <img src={pokemon.image} alt={pokemon.name} /> */}
//         <Img src={pokemon.image} alt={pokemon.name} />
//       </div>
//       <PokemonDataView pokemon={pokemon} />
//     </div>
//   )
// }

// const SUSPENSE_CONFIG = {
//   timeoutMs: 4000,
//   busyDelayMs: 300,
//   busyMinDurationMs: 700,
// }

// const pokemonResourceCache = {}

// function getPokemonResource(name) {
//   const lowerName = name.toLowerCase()
//   let resource = pokemonResourceCache[lowerName]
//   if (!resource) {
//     resource = createPokemonResource(lowerName)
//     pokemonResourceCache[lowerName] = resource
//   }
//   return resource
// }

// function createPokemonResource(pokemonName) {
//   return createResource(fetchPokemon(pokemonName))
// }

// function App() {
//   const [pokemonName, setPokemonName] = React.useState('')
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

//   function handleSubmit(newPokemonName) {
//     setPokemonName(newPokemonName)
//   }

//   function handleReset() {
//     setPokemonName('')
//   }

//   return (
//     <div className="pokemon-info-app">
//       <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
//       <hr />
//       <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
//         {pokemonResource ? (
//           <PokemonErrorBoundary
//             onReset={handleReset}
//             resetKeys={[pokemonResource]}
//           >
//             <React.Suspense
//               fallback={<PokemonInfoFallback name={pokemonName} />}
//             >
//               <PokemonInfo pokemonResource={pokemonResource} />
//             </React.Suspense>
//           </PokemonErrorBoundary>
//         ) : (
//           'Submit a pokemon'
//         )}
//       </div>
//     </div>
//   )
// }

// export default App

// Suspense Image
// http://localhost:3000/isolated/exercise/05.js

/*
We're here going for next solution for "render as you fetch" method.
so we're lazily loading the PokemonInfo component after all the data related to it is fetched
*/

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
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
window.useRealAPI = true;

function preloadImage(src){
  return new Promise(resolve =>{
    const img = document.createElement('img')
    img.src = src;
    img.onload = () => resolve(src);
  })
}

//5-3- a- removing the func and lazily loading this comp.
// function PokemonInfo({pokemonResource}) {
//     const pokemon = pokemonResource.data.read()
//   return (
//     <div>
//       <div className="pokemon-info__img-wrapper">
//         <img src={pokemonResource.image.read()} alt={pokemon.name} />
//       </div>
//       <PokemonDataView pokemon={pokemon} />
//     </div>
//   )
// }

const PokemonInfo = React.lazy(()=> 
import('../lazy/pokemon-info-render-as-you-fetch'));

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
