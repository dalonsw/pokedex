//Pesquisa e busca
const pokemonBusca = document.getElementById("pokemon")
const botaoPesquisa = document.querySelector("#find-button")

//Dados a serem atualizados
const pName = document.getElementById("poke-name");
const pSpecies = document.getElementById("poke-species");
const pNumber = document.getElementById("poke-num");
const pImage = document.getElementById("poke-img");
const pTypes = document.getElementsByClassName("types");


//Pegar informações sobre a espécie Pokémon
const fetchPokemonSpecies = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
    const data = await APIResponse.json()
    return data
}

//Pegar mais informações sobre o Pokémon
const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const data = await APIResponse.json()
    return data
}

//Função para atualizar e mostrar dados no Front-end
const mostrarInformacoesPokemonSpecies = async (data) => {
    //Pegar mais informações
    const pokemonMoreData = await fetchPokemon(data.id)
    await console.log(pokemonMoreData.types)

    //Alterar e tratar os dados
    const pokeNumber = `${data.id}`;
    const imgURL = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokeNumber.padStart(3, "0")}.png`
    const formatarNome = (nome) => {
        let nomeArray = nome.split("");
        let primeiraLetraUpper = nomeArray.shift().toUpperCase();
        nomeArray.unshift(primeiraLetraUpper);
        let nomeCompleto = nomeArray.join("")
        return nomeCompleto;
    }

    //Validar o título em inglês
    const validarGenus = (generaArray) => {
        for(let i = 0; i < generaArray.length; i++){
            if(data.genera[i].language.name === "en"){
                return data.genera[i].genus
            }
        }
    }

    //Atribuir dados
    pName.innerText = formatarNome(data.name)
    pSpecies.innerText = validarGenus(data.genera);
    pNumber.innerText = `#${pokeNumber.padStart(4, "0")}`
    pImage.setAttribute("src", imgURL)

}

botaoPesquisa.addEventListener("click", async () => {
    const pokeSpeciesData = await fetchPokemonSpecies(pokemonBusca.value.toLowerCase())
    await console.log(pokeSpeciesData)

    await mostrarInformacoesPokemonSpecies(pokeSpeciesData);
})