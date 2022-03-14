// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

/*
we're pulling more classified loading fallback 
*/

import * as React from 'react'
//1-3-a- addding PokemonInfoFallback in the import
import {PokemonDataView,fetchPokemon,PokemonInfoFallback,PokemonErrorBoundary} from '../pokemon'

//1-3-c- removing the same function and adding import to this func
import { createResource } from 'utils';

// function createResource(promise){
//     let status = 'pending'
//     let result = promise.then(
//         resolved => {
//             status = 'resolved'
//             result=resolved
//         },
//         rejected => {
//             status='rejected'
//             result=rejected
//         }
//     );
//     return {
//         read(){
//             if(status === 'pending') throw result
//             if(status === 'rejected') throw result
//             if(status === 'resolved') throw result
//         }
//     }
// }
const pokemonResource = createResource(fetchPokemon('pikachus'));

function PokemonInfo() {
const pokemon = pokemonResource.read();

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
            {/* removing loading  and adding the PokemonInfoFallback as fallback */}
            <React.Suspense fallback={<PokemonInfoFallback name='Pikachu'/>}>
            <PokemonInfo />
            </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
