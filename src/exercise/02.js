// Render as you fetch concurrent mode
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
// 2-1-k - 🐨 you'll need createResource from ../utils
import { createResource } from 'utils'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  // 2-1-c- 🐨 you'll need PokemonErrorBoundary here
  PokemonErrorBoundary
} from '../pokemon'


// 🐨 Your goal is to refactor this traditional useEffect-style async
// interaction to suspense with resources. Enjoy!

function PokemonInfo({pokemonResource}) {
  // 💣 you're pretty much going to delete all this stuff except for the one
  // place where 🐨 appears
  
  //2-1-i - from state to useEffect is managed by APP so no need

  // const [state, setState] = React.useReducer((s, a) => ({...s, ...a}), {
  //   pokemon: null,
  //   error: null,
  //   status: 'pending',
  // })

  // const {pokemon, error, status} = state

  
  // React.useEffect(() => {
  //   let current = true
  //   setState({status: 'pending'})
  //   fetchPokemon(pokemonName).then(
  //     p => {
  //       if (current) setState({pokemon: p, status: 'success'})
  //     },
  //     e => {
  //       if (current) setState({error: e, status: 'error'})
  //     },
  //   )
  //   return () => (current = false)
  // }, [pokemonName])

  // 💰 This will be the fallback prop of <React.Suspense />

  //2-1-e - commenting this since already covered in suspence in App comp
  // if (status === 'pending') {
  //   return <PokemonInfoFallback name={pokemonName} />
  // }

  // 2-1-f 💰 This is the same thing the PokemonErrorBoundary renders
  // if (status === 'error') {
  //   return (
  //     <div>
  //       There was an error.
  //       <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  //     </div>
  //   )
  // }

  // 💰 this is the part that will suspend
  
  //2-1-j - now this comp will render once it is successful so removing the success cond

  // if (status === 'success') {
    // 🐨 instead of accepting the pokemonName as a prop to this component
    // you'll accept a pokemonResource.
    // 💰 you'll get the pokemon from: pokemonResource.read()
    // 🐨 This will be the return value of this component. You won't need it
    // to be in this if statement anymore though!

    //2-1-k - take pokemon from pokemonResource.read()
    const pokemon = pokemonResource.read();

    return (
      <div>
        <div className="pokemon-info__img-wrapper">
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
        <PokemonDataView pokemon={pokemon} />
      </div>
    )
  // }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');
  //2-1-b create state of pokemonResouce
  const [pokemonResource,setPokemonResource] = React.useState(null);
  // 🐨 add a useState here to keep track of the current pokemonResource

  //2-1-a- useEffect
  React.useEffect(()=>{
    if(!pokemonName){
    setPokemonResource(null);
    return;  
    }
    
    setPokemonResource(createResource(fetchPokemon(pokemonName)));
  },[pokemonName]);
  // 🐨 Add a useEffect here to set the pokemon resource to a createResource
  // with fetchPokemon whenever the pokemonName changes.
  // If the pokemonName is falsy, then set the pokemon resource to null

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  //2-1-h- adding handleReset function for reset
  function handleReset(){
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonResource ? ( // 🐨 instead of pokemonName, use pokemonResource here
          // 🐨 wrap PokemonInfo in a PokemonErrorBoundary and React.Suspense component
          // to manage the error and loading states that PokemonInfo was managing
          // before your changes.
          //
          // 💰 The PokemonErrorBoundary has the ability to recover from errors
          // if you pass an onReset handler (or resetKeys). As a mini
          // extra-credit, try to make that work.
          // 📜 https://www.npmjs.com/package/react-error-boundary

          // 2-1-f adding error part from PokemonInfo and adding error boundary
          //2-1-g - adding reset for user to try again searching pokemon with button to reset it
          <PokemonErrorBoundary onReset={handleReset}
          resetKeys={[pokemonResource]}
          >
          {/* //2-1-d- adding suspense and copy fallback from status pending condition */}
          <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
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
