// Cache resources
// http://localhost:3000/isolated/exercise/04.js

//extra2- the cache is a module level cache but here we're adding the provider and 
//state so that we can controll it better;

import * as React from 'react'
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

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}


// const PokemonResourceCacheContext = React.createContext(getPokemonResource);

//4-2-c- removing the default val from context since the value is provided in Provider 
const PokemonResourceCacheContext = React.createContext();
// const pokemonResourceCache = {}

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

// function getPokemonResource(name){
//   const lowerName = name.toLowerCase();
//   let  resource = pokemonResourceCache[lowerName];
//   if(!resource){
//     resource = createPokemonResource(lowerName);
//     pokemonResourceCache[lowerName] = resource;
//   }
//   return resource;
// }

//4-2-a- adding cacheProvider function
//4-2-d - moving the pokemonResourceCache var and its func inside provider func
function PokemonCacheProvider({children}){
    //to make cache consistent through re-renders
    // const pokemonResourceCache = {}
    const cache = React.useRef({});

    //making the getPokemonResource consistent func since it is mentioned in list of dependencies
    const getPokemonResource = React.useCallback((name)=> {
        const lowerName = name.toLowerCase();
        let  resource = cache.current[lowerName];
        if(!resource){
          resource = createPokemonResource(lowerName);
          cache.current[lowerName] = resource;
        }
        return resource;
      },[]);
      
    return <PokemonResourceCacheContext.Provider value={getPokemonResource}>
        {children}
    </PokemonResourceCacheContext.Provider>
}
function usePokemonResourceCache(){
  return React.useContext(PokemonResourceCacheContext);
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)
  const  getPokemonResource = usePokemonResourceCache();
  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition,getPokemonResource])

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
//4-2-b  - wrapping the provider in Appp and adding this as new function
function AppWithProvider(){
    return (
        <PokemonCacheProvider>
            <App/>
        </PokemonCacheProvider>
    )
}
//4-2-c- exporting the AppWithProvider component
// export default App;
export default AppWithProvider;
