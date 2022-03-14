// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

/*
data Fetching with wrong pokemon that doesn't exist it will display fallbakc infinitely.
so we're adding Error hanlder here to get rid of that
*/

import * as React from 'react'
//1-2-c- adding error boundary for error handler
import {PokemonDataView,fetchPokemon,PokemonErrorBoundary} from '../pokemon'

let pokemon,pokemonError;

//1-2-a - adding error handler in fetching unidentified pokemon 
const pokemonPromise = fetchPokemon('pikachus').then(
    pokemonData => {pokemon = pokemonData},
    error => {pokemonError = error}
);

function PokemonInfo() {
//1-2-b - adding error throw error
if(pokemonError) throw pokemonError;

  if(!pokemon){
    throw pokemonPromise;
  }

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
        {/* 1-2-d - addign error boundary in the code */}
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
