// useTransition for improved loading states
// http://localhost:3000/isolated/exercise/03.js

// we want to configure how long isPending should be true before react goes and 
  // reverts to fallback component

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

// 3-1-b- 🐨 create a SUSPENSE_CONFIG variable right here and configure timeoutMs to
// whatever feels right to you, then try it out and tweak it until you're happy
// with the experience.

const SUSPENSE_CONFIG = {timeoutMs:4000};

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
  // delay = 200
  return createResource(fetchPokemon(pokemonName, delay))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  // 3-1-a- 🐨 add a useTransition hook here
  //3-1-b - passign the SUSPENSE_CONFIG in useTranstion
  const [startTransition,isPending] = React.useTransition(SUSPENSE_CONFIG);

  //it will give two items func startTransition, boolean ispending
  // isPending - is set to be true while we r waiting for this async thing to finish
  //startTranistion = is responsible to what transition is it takes to trigger isPending to be true
  // if that results in suspending Component.
  // we want to configure how long isPending should be true before react goes and 
  // reverts to fallback component

  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    // 3-1-d- 🐨 wrap this next line in a startTransition call and add dependency
    startTransition(()=> {
      setPokemonResource(createPokemonResource(pokemonName));
    });
    // 🐨 add startTransition to the deps list here
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
        3-1-e - 🐨 add inline styles here to set the opacity to 0.6 if the
        useTransition above is pending
      */}
      <div className="pokemon-info" style={{opacity:isPending ? 0.6 : 1}}>
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
