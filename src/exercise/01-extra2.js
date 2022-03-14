// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

/*
we're abstracting the pokemon handling and error hanlding out of comp and separate body to
seporate new function.
*/

import * as React from 'react'
import {PokemonDataView,fetchPokemon,PokemonErrorBoundary} from '../pokemon'

//1-3-a- abstracing this and eror of the comp
// let pokemon,pokemonError;
 
// const pokemonPromise = fetchPokemon('pikachus').then(
//     pokemonData => {pokemon = pokemonData},
//     error => {pokemonError = error}
// );

function createResource(promise){
    let status = 'pending'
    let result = promise.then(
        resolved => {
            status = 'resolved'
            result=resolved
        },
        rejected => {
            status='rejected'
            result=rejected
        }
    );
    return {
        read(){
            if(status === 'pending') throw result
            if(status === 'rejected') throw result
            if(status === 'resolved') throw result
        }
    }
}
//1-3-b- sending the promise throw above generic function
const pokemonResource = createResource(fetchPokemon('pikachus'));

function PokemonInfo() {
    //1-3-c-commmenting this and using the return add func to check status and result
// if(pokemonError) throw pokemonError;

//   if(!pokemon){
//     throw pokemonPromise;
//   }

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
            <React.Suspense fallback={<div>Loading Pikachu...</div>}>
            <PokemonInfo />
            </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
