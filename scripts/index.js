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
const pAbilities = document.getElementById("poke-ability")
const pEvoContainer = document.getElementById('poke-evos-container')


//Pegar informações sobre a API
const fetchAPI = async (URL) => {
    const APIResponse = await fetch(URL)
    const data = await APIResponse.json()
    return data
}

//Função para atualizar e mostrar dados no Front-end
const mostrarInformacoesPokemonSpecies = async (data) => {
    //Pegar mais informações
    const pokemonMoreData = await fetchAPI(`https://pokeapi.co/api/v2/pokemon/${data.id}`)
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
        return nomeCompleto.replaceAll("-", " ");
    }
    const pokeTypes = pokemonMoreData.types
    const descricaoTraduzida = await fetchAPI(`https://api.mymemory.translated.net/get?q=${validarDesc(data.flavor_text_entries).replaceAll("\n", " ").replaceAll("\f", " ")}&langpair=en|pt`)
    const pokeAbilities = pokemonMoreData.abilities;

    //Atribuir dados
    pName.innerText = formatarNome(data.name);
    pSpecies.innerText = validarGenus(data.genera);
    pNumber.innerText = `#${pokeNumber.padStart(4, "0")}`;
    pImage.setAttribute("src", imgURL);
    pWeight.innerText = pokemonMoreData.weight / 10
    pHeight.innerText = pokemonMoreData.height / 10
    pDescription.innerText = descricaoTraduzida.responseData.translatedText

    //Alterar o Tipo
    for(let type in pokeTypes){
        pTypes[type].setAttribute("id", pokeTypes[type].type.name)
        pTypes[type].innerText = formatarNome(pokeTypes[type].type.name)
        if(pokeTypes.length === 1){
            pTypes[1].setAttribute("id", "no2type")
            pTypes[1].innerText = "no2type"
        }
    }

    //Abillitys
    pAbilities.innerHTML = ""
    for(let i in pokeAbilities){
        let abilityDesc = document.createElement("p")
        abilityDesc.innerHTML = formatarNome(`${pokeAbilities[i].ability.name}`).replaceAll("-", " ")
        if(pokeAbilities[i].is_hidden == true){
            abilityDesc.innerHTML = `${formatarNome(`${pokeAbilities[i].ability.name}`).replaceAll("-", " ")} <span>(hidden)</span>`
            pAbilities.appendChild(abilityDesc)
        }
        pAbilities.appendChild(abilityDesc)
    }

    //Pegar evoluções
    pEvoContainer.innerHTML = ""
    const pEvos = await fetchAPI(data.evolution_chain.url)
    console.log(pEvos)
    const pBasicNumber = pEvos.chain.species.url.slice(42, 46).replaceAll("/", "")

    if(pEvos.chain.evolves_to.length == 0){
        const evoUnica = document.createElement("div")
        evoUnica.className = "evos"
        evoUnica.setAttribute("id", "evos0")
        evoUnica.innerHTML = `<div class="evo" id="evo0">
        <img src="https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/${pEvos.chain.species.name}.avif"/>
        <p>${formatarNome(pEvos.chain.species.name)}</p>
        </div>`
        pEvoContainer.appendChild(evoUnica)
    }
    
    for(let i in pEvos.chain.evolves_to){
        
        const evoFirst = document.createElement("div")
        evoFirst.className = "evos"
        evoFirst.setAttribute("id", `evos${i}`)
        const pEvo0Number = pEvos.chain.species.url.slice(42, 46).replaceAll("/", "")
        evoFirst.innerHTML = `<div class="evo" id="evo0">
        <img src="https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/${pEvos.chain.species.name}.avif"/>
        <p>${formatarNome(pEvos.chain.species.name)}</p>
        </div>`
        pEvoContainer.appendChild(evoFirst)

        const pEvo1Number = pEvos.chain.evolves_to[i].species.url.slice(42, 46).replaceAll("/", "")
        evoFirst.innerHTML += `<img class="seta" src="images/seta-direita.png" />
                                <div class="evo" id="evo${i}">
                                    <img
                                        src="https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/${pEvos.chain.evolves_to[i].species.name}.avif"
                                    />
                                    <p>${formatarNome(pEvos.chain.evolves_to[i].species.name)}</p>
                              </div>`

        if(pEvos.chain.evolves_to[i].evolves_to[i] != undefined){
            console.log("Tem evolução: " + pEvos.chain.evolves_to[i].evolves_to[i].species.name)
            const pEvo2Number = pEvos.chain.evolves_to[i].evolves_to[i].species.url.slice(42, 46).replaceAll("/", "")
            evoFirst.innerHTML += `<img class="seta" src="images/seta-direita.png" />
                                    <div class="evo" id="evo${i}">
                                        <img
                                            src="https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/${pEvos.chain.evolves_to[i].evolves_to[i].species.name}.avif"
                                        />
                                        <p>${formatarNome(pEvos.chain.evolves_to[i].evolves_to[i].species.name)}</p>
                                  </div>`
            if(pEvos.chain.evolves_to[i].evolves_to.length > 1){
                const pEvo3Number = pEvos.chain.evolves_to[i].evolves_to[1].species.url.slice(42, 46).replaceAll("/", "")
                evoFirst.innerHTML += `<h4> ou </h4>
                                        <div class="evo" id="evo${i}">
                                            <img
                                                src="https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/${pEvos.chain.evolves_to[i].evolves_to[1].species.name}.avif"
                                            />
                                            <p>${formatarNome(pEvos.chain.evolves_to[i].evolves_to[1].species.name)}</p>
                                      </div>`
                console.log(pEvos)
            }
        }
    }
}

const buscarPokemon = async () => {
    try{
        const pokeSpeciesData = await fetchAPI(`https://pokeapi.co/api/v2/pokemon-species/${pokemonBusca.value.toLowerCase()}`)
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