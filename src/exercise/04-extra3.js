// Cache resources
// http://localhost:3000/isolated/exercise/04.js

//extra3- adding the cahce timeout functionality  

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

const PokemonResourceCacheContext = React.createContext();

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}
//adding the cacheTime from provider
function PokemonCacheProvider({children,cacheTime}){
    
    const cache = React.useRef({});
    //4-3-b- adding the Ref for expiration of cache
    const expirations = React.useRef({});

    //4-3-c- adding sideeffect to check on expiration of cache
    React.useEffect(()=>{
        const interval = setInterval(()=>{
            for(const [name,time] of Object.entries(expirations.current)){
                if(time<Date.now()) delete cache.current[name];
            }
        },1000);

        return () => clearInterval(interval);
    },[]);

    const getPokemonResource = React.useCallback((name)=> {
        const lowerName = name.toLowerCase();
        let  resource = cache.current[lowerName];
        if(!resource){
          resource = createPokemonResource(lowerName);
          cache.current[lowerName] = resource;
        }
        return resource;
      },[cacheTime]);
      
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

function AppWithProvider(){
    return (
        //4-3-a-  adding the cachetimeout in provider comp
        <PokemonCacheProvider cacheTime={5000}>
            <App/>
        </PokemonCacheProvider>
    )
}

export default AppWithProvider;
