// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

/*
data Fetching with react,suspence and concurrent mode 
*/

import * as React from 'react'
// 1-1-a- 🐨 you'll also need to get the fetchPokemon function from ../pokemon:
import {PokemonDataView,fetchPokemon} from '../pokemon'

// 💰 use it like this: fetchPokemon(pokemonName).then(handleSuccess, handleFailure)

// 🐨 create a variable called "pokemon" (using let)

// 💣 delete this now...
// const pokemon = {
//   name: 'TODO',
//   number: 'TODO',
//   attacks: {
//     special: [{name: 'TODO', type: 'TODO', damage: 'TODO'}],
//   },
//   fetchedAt: 'TODO',
// }
let pokemon;

// We don't need the app to be mounted to know that we want to fetch the pokemon
// named "pikachu" so we can go ahead and do that right here.
// 🐨 assign a pokemonPromise variable to a call to fetchPokemon('pikachu')

// 🐨 when the promise resolves, assign the "pokemon" variable to the resolved value
// 💰 For example: somePromise.then(resolvedValue => (someValue = resolvedValue))

//1-1-b - currently sideeffect we perform with useEffect and we do those in render function
//2nd problem - the callbakc func will not get called unless we fetch pikachu so it will render nothing
// and how will react know if pokemon is fetched and it needs to new rerendered
//so we need some mechanism to let react know it is not ready to render and i'll let you know
// when the data will be ready to showcase to frontend

const pokemonPromise = fetchPokemon('pikachu').then((pokemonData) => {
  pokemon = pokemonData;
});

function PokemonInfo() {
  // 🐨 if there's no pokemon yet, then throw the pokemonPromise
  // 💰 (no, for real. Like: `throw pokemonPromise`)
  //1-1-c- 
  /*so we take the pokemon promise outside this func and we'll check if !pokemon 
  then its not resolved and we haven't assigned it ot pokemon data that comes back
  so We need to give react return pokemonPromise so that react will when to display but it will not work
  superwell so we need to throw pokemonPromise and react is working inside the try catch so react
  will catch the pokemonPromise and attach its own then handler which says when it is resolved then
  let's go Rerender the pokemoninfo comp. we know that pokemon data is loaded n so we return jsx rather than
  throwing pokemon promise again
  */
  if(!pokemon){
    throw pokemonPromise;
  }

  // if the code gets it this far, then the pokemon variable is defined and
  // rendering can continue!
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
        {/* 1-1-d- 🐨 Wrap the PokemonInfo component with a React.Suspense component with a fallback */}
        <React.Suspense fallback={<div>Loading Pikachu...</div>}>
        <PokemonInfo />
        </React.Suspense>
      </div>
    </div>
  )
}

export default App
