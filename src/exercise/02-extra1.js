// Render as you fetch concurrent mode
// http://localhost:3000/isolated/exercise/02.js

/* movement of suspense and error boundary it affects eith placement of these 
since it changes the UI of these*/

import * as React from 'react'
import { createResource } from 'utils'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary
} from '../pokemon'

function PokemonInfo({pokemonResource}) {
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
  const [pokemonName, setPokemonName] = React.useState('');
  const [pokemonResource,setPokemonResource] = React.useState(null);
  
  React.useEffect(()=>{
    if(!pokemonName){
    setPokemonResource(null);
    return;  
    }
    
    setPokemonResource(createResource(fetchPokemon(pokemonName)));
  },[pokemonName]);
  

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset(){
    setPokemonName('')
  }
//   <div className="pokemon-info-app">
//       <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
//       <hr />
//       <div className="pokemon-info">
//         {pokemonResource ? ( 
//           <PokemonErrorBoundary onReset={handleReset}
//           resetKeys={[pokemonResource]}
//           >
//           <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
//             <PokemonInfo pokemonResource={pokemonResource} />
//           </React.Suspense>
//           </PokemonErrorBoundary>
//         ) : (
//           'Submit a pokemon'
//         )}
//       </div>
//     </div>

// 2-2-a- updating the position of suspence and adding pokemon info container around in fallback UI
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
        <React.Suspense 
            fallback={
                <div className="pokemon-info">
                <PokemonInfoFallback name={pokemonName} />
                </div>
            }>
            <div className="pokemon-info">
                {pokemonResource ? ( 
                <PokemonErrorBoundary onReset={handleReset}
                resetKeys={[pokemonResource]}
                >
                    <PokemonInfo pokemonResource={pokemonResource} />
                </PokemonErrorBoundary>
                ) : (
                    'Submit a pokemon'
                    )}
            </div>
        </React.Suspense>
    </div>
  )
}

export default App
