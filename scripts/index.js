//Pesquisa e busca
const pokemonBusca = document.getElementById("pokemon")
const botaoPesquisa = document.querySelector("#find-button")

//Dados a serem atualizados
const pName = document.getElementById("poke-name");
const pSpecies = document.getElementById("poke-species");
const pNumber = document.getElementById("poke-num");
const pImage = document.getElementById("poke-img");
const pTypes = document.getElementsByClassName("types");
const pWeight = document.getElementById("peso");
const pHeight = document.getElementById("altura");
const pDescription = document.getElementById("pokedex-description");

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

//API de Tradução
const translate = async (text) => {
    const APIResponse = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=en|pt`)
    const data = await APIResponse.json()
    return data
} 

//Função para atualizar e mostrar dados no Front-end
const mostrarInformacoesPokemonSpecies = async (data) => {
    //Pegar mais informações
    const pokemonMoreData = await fetchPokemon(data.id)
    console.log(pokemonMoreData)

//Alterar e tratar os dados
    //Validar o título em inglês
    const validarGenus = (generaArray) => {
        for(let i = 0; i < generaArray.length; i++){
            if(data.genera[i].language.name === "en"){
                return data.genera[i].genus
            }
        }
    }

    //Validar o descrição em inglês
    const validarDesc = (descArray) => {
        for(let i = 0; i < descArray.length; i++){
            if(data.flavor_text_entries[i].language.name === "en"){
                return data.flavor_text_entries[i].flavor_text
            }
        }
    }
        
    const pokeNumber = `${data.id}`;
    const imgURL = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokeNumber.padStart(3, "0")}.png`
    const formatarNome = (nome) => {
        let nomeArray = nome.split("");
        let primeiraLetraUpper = nomeArray.shift().toUpperCase();
        nomeArray.unshift(primeiraLetraUpper);
        let nomeCompleto = nomeArray.join("")
        return nomeCompleto;
    }
    const pokeTypes = pokemonMoreData.types
    const descricaoTraduzida = await translate(validarDesc(data.flavor_text_entries).replaceAll("\n", " ").replaceAll("\f", " "))

    //Atribuir dados
    pName.innerText = formatarNome(data.name);
    pSpecies.innerText = validarGenus(data.genera);
    pNumber.innerText = `#${pokeNumber.padStart(4, "0")}`;
    pImage.setAttribute("src", imgURL);
    pWeight.innerText = pokemonMoreData.weight / 10
    pHeight.innerText = pokemonMoreData.height / 10
    pDescription.innerText = descricaoTraduzida.responseData.translatedText
    console.log(descricaoTraduzida)
    
    //Formatar Nome Tipo
    const formatarTipo = (tipo) => {
        let nomeTipoArray = tipo.split('');
        let nomeTipoUpper = nomeTipoArray.shift().toUpperCase();
        nomeTipoArray.unshift(nomeTipoUpper);
        let nomeTipoCompleto = nomeTipoArray.join("")
        return nomeTipoCompleto
    }

    //Alterar o Tipo
    for(let type in pokeTypes){
        pTypes[type].setAttribute("id", pokeTypes[type].type.name)
        pTypes[type].innerText = formatarTipo(pokeTypes[type].type.name)
        if(pokeTypes.length === 1){
            pTypes[1].setAttribute("id", "no2type")
            pTypes[1].innerText = "no2type"
        }
    }

}

const buscarPokemon = async () => {
    try{
        const pokeSpeciesData = await fetchPokemonSpecies(pokemonBusca.value.toLowerCase())
        await console.log(pokeSpeciesData)
    
        await mostrarInformacoesPokemonSpecies(pokeSpeciesData);
    }
    catch (err){
        pokemonBusca.value = "";
        pokemonBusca.setAttribute("placeholder", "Esse pokémon não existe...");
        console.log(err)
    }

}

botaoPesquisa.addEventListener("click", () => {
    buscarPokemon()
})

pokemonBusca.addEventListener("keydown", (key) => {
    if(key.key === "Enter"){
        buscarPokemon()
    }
})