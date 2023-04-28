
import { render } from 'react-dom';
import React, { useState, useEffect } from 'react';

const categoryColors = {
grass: 'green',
poison: 'purple',
fire: 'darkred',
water: 'darkblue',
flying: 'green',
bug: 'brown',
normal: 'black',
electric: 'blue',
ground: 'brown',
fighting: 'red',
psychic: 'darkpurple',
rock: 'gray',
steel: 'gray',
fairy: 'pink',
ice: 'whiteblue',
ghost: 'gray',
dragon: 'red',
ice: 'darkblue',
psychic: 'purple',
dark: 'darkgreen',
// Додаткові кольори для інших категорій можна додати тут
};
function PokemonCard({ title, imageUrl, categories }) {
  const [showCharacteristics, setShowCharacteristics] = useState(false);
  const [characteristics, setCharacteristics] = useState(null);

const handleShowCharacteristics = async () => {
  if (characteristics) {
    setShowCharacteristics(!showCharacteristics);
  } else {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${title}`);
    const data = await response.json();
    setCharacteristics(data);
    setShowCharacteristics(true);
  }
};


  const categoryColors = {
    grass: 'green',
    poison: 'purple',
    fire: 'darkred',
    water: 'darkblue',
    flying: 'green',
    bug: 'brown',
    normal: 'black',
    electric: 'yellow',
    ground: 'brown',
    fighting: 'red',
    psychic: 'darkpurple',
    rock: 'gray',
    steel: 'gray',
    ice: 'whiteblue',
    ghost: 'white',
    dragon: 'red',
    dark: 'darkgreen',
    // Додаткові кольори для інших категорій можна додати тут
  };
  return ( 
    <div className="pokemon-card" onClick={handleShowCharacteristics}> 
      <img src={imageUrl} alt={title} /> 
      <h1>{title}</h1>
      <div>
        {categories.map((category, index) => (
          <span
            key={index}
            style={{
              backgroundColor: categoryColors[category],
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              marginRight: '8px',
            }}
          >
            {category}
          </span>
        ))}
      </div>
      {showCharacteristics && characteristics && (
        <div>
          <p style={{color: '#fff'}}>Height: {characteristics.height}</p>
          <p style={{color: '#fff'}}>Weight: {characteristics.weight}</p>
          <p style={{color: '#fff'}}>Abilities:</p>
          <ul>
            {characteristics.abilities.map((ability) => (
              <li style={{color: '#fff'}} key={ability.ability.name}>{ability.ability.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
const pokemonContainerStyles = {
display: 'grid',
gridTemplateColumns: 'repeat(3, 1fr)', // 3 колонки
gridGap: '20px',
};

function App() {
const [showTypes, setShowTypes] = useState(false);
const handleShowTypes = () => {
	setShowTypes(!showTypes);
};
const [searchTerm, setSearchTerm] = useState('');
const [pokemonPerPage, setPokemonPerPage] = useState(10);
const [pokemonData, setPokemonData] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedTypes, setSelectedTypes] = useState([]);

useEffect(() => {
const fetchPokemonData = async () => {
setLoading(true);
const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
const data = await response.json();
const pokemonList = data.results;
const pokemonDataList = await Promise.all(
pokemonList.map(async (pokemon) => {
const response = await fetch(pokemon.url);
const data = await response.json();
return {
id: data.id,
name: data.name,
imageUrl: `https://img.pokemondb.net/artwork/large/${data.name}.jpg`,
categories: data.types.map((type) => type.type.name),
};
})
);
setPokemonData(pokemonDataList);
setLoading(false);
};
fetchPokemonData();
}, []);

const handleSearch = (event) => {
setSearchTerm(event.target.value);
};

const handlePokemonPerPage = (event) => {
setPokemonPerPage(Number(event.target.value));
};

const handleTypeSelection = (event) => {
const type = event.target.value;
if (selectedTypes.includes(type)) {
setSelectedTypes(selectedTypes.filter((t) => t !== type));
} else {
setSelectedTypes([...selectedTypes, type]);
}
};

  const filteredPokemonByType = pokemonData.filter((pokemon) =>
    selectedTypes.length === 0 ? true : selectedTypes.some((type) => pokemon.categories.includes(type))
  );

const filteredPokemonByName = filteredPokemonByType.filter((pokemon) =>
pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const pokemonToDisplay = filteredPokemonByName.slice(0, pokemonPerPage);

const uniqueTypes = [...new Set(pokemonData.flatMap((pokemon) => pokemon.categories))];

return (
<div className="app">
<div className="search-container">
  <input type="text" placeholder="Search by name" onChange={handleSearch} />
  <div className="buttons-container">
    <button onClick={handlePokemonPerPage} value="10">10</button>
    <button onClick={handlePokemonPerPage} value="20">20</button>
    <button onClick={handlePokemonPerPage} value="50">50</button>
  </div>
  <button onClick={() => setShowTypes(!showTypes)}>&#8644;</button>
  {showTypes && (
    <div className="checkboxes-container">
      {uniqueTypes.map((type, index) => (	
        <label key={index}>
          <input
            type="checkbox"
            checked={selectedTypes.includes(type)}
            value={type}
            onChange={handleTypeSelection}
          />
           <span
    style={{
      backgroundColor: categoryColors[type],
      color: '#fff',
      padding: '4px 8px',
      borderRadius: '4px',
      marginLeft: '8px',
    }}
  >
   {type}
  </span>
        </label>
      ))}
    </div>
  )}
</div>
<div className="pokemon-container" style={pokemonContainerStyles}>
{loading && <p>Loading...</p>}
{!loading && pokemonToDisplay.map((pokemon) => (
<PokemonCard
key={pokemon.id}
title={pokemon.name}
imageUrl={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
categories={pokemon.categories}
/>
))}
</div>
</div>
);
}
render(<App />, document.getElementById('root'));