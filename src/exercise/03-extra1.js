// useTransition for improved loading states
// http://localhost:3000/isolated/exercise/03.js

/* extra-1 the screen is flashing if we update the delay to 200ms and lower 
so here we are adding class with transition delay so we dont see flash in loading the pokemon

extra-2 if delay is 500 then it is workign fine but for if we do a delay of 450 then it looks like
flash in clicking pic. 
*/

  import * as React from 'react'
  import { Component } from 'react'
  import {
    fetchPokemon,
    PokemonInfoFallback,
    PokemonForm,
    PokemonDataView,
    PokemonErrorBoundary,
  } from '../pokemon'
  import {createResource} from '../utils'
  
  function PokemonInfo({pokemonResource}) {
    const pokemon = pokemonResource.read()
    return (
      <div>
        <div className="pokemon-info__img-wrapper">
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
        <PokemonDataView pokemon={pokemon} />
      </div>
    )
  }
 
  //3-2-a- adding the busyDelayMs,busyMinDurationMs attribute ot config
  /*we will two attribute here
  if we're pending for certain amount of time so we need to stay pending for a additional amt of time.
  busyDelay: if were going to pending for 300ms which is shorter than time we have set
   of our css transition
   then i need to busy Min for total atleast 700ms

   if we'rer pending for this amt of time (busyDelay) then we need to be pending for atleast this amt of time
   (busyMinDurationMs) even if tthe delay resolves in 500ms.
  */
  const SUSPENSE_CONFIG = {
      timeoutMs:4000,
      busyDelayMs:300,
      busyMinDurationMs:700
    };
  
  function createPokemonResource(pokemonName) {
    // 🦉 once you've finished the exercise, play around with the delay...
    // the second parameter to fetchPokemon is a delay so you can play around
    // with different timings
    let delay = 1500
    // try a few of these fetch times:
    // shows busy indicator
    // delay = 450
  
    // shows busy indicator, then suspense fallback
    // delay = 5000
  
    // shows busy indicator for a split second
    // 💯 this is what the extra credit improves
    delay = 200
    return createResource(fetchPokemon(pokemonName, delay))
  }
  
  function App() {
    const [pokemonName, setPokemonName] = React.useState('')
    const [startTransition,isPending] = React.useTransition(SUSPENSE_CONFIG);
  
    const [pokemonResource, setPokemonResource] = React.useState(null)
  
    React.useEffect(() => {
      if (!pokemonName) {
        setPokemonResource(null)
        return
      }
      startTransition(()=> {
        setPokemonResource(createPokemonResource(pokemonName));
      });
    }, [pokemonName,startTransition])
  
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
        {/*
          3-1-e - 🐨 add class here to set the transition delay and update it 
        */}
        <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`} style={{opacity:isPending ? 0.6 : 1}}>
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
  