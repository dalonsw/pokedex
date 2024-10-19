const pokemon = document.getElementById("pokemon")
const botaoPesquisa = document.querySelector("#find-button")

const pName = document.getElementById("poke-name");
const pSpecies = document.getElementById("poke-species");
const pNumber = document.getElementById("poke-num");
const pImage = document.getElementById("poke-img");
const pTypes = document.getElementsByClassName("types");

botaoPesquisa.addEventListener("click", () => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.value.toLowerCase()}`)
     .then(response => {
        if(response.status === 404){
            throw new Error("Esse dado não existe no banco de dados")
        }
        if(!response.ok){
            throw new Error("Erro desconhecido" + response.status)
        }
        return response.json()
     })
     .then(data => {
        console.log(data)
        const pokeNumber = `${data.id}`;
        const imgURL = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokeNumber.padStart(3, "0")}.png`
        const formatarNome = (nome) => {
            let nomeArray = nome.split("");
            let primeiraLetraUpper = nomeArray.shift().toUpperCase();
            nomeArray.unshift(primeiraLetraUpper);
            let nomeCompleto = nomeArray.join("")
            return nomeCompleto;
        }

        const validarGenus = (generaArray) => {
            for(let i = 0; i < generaArray.length; i++){
                if(data.genera[i].language.name === "en"){
                    return data.genera[i].genus
                }
            }
        }

        pName.innerText = formatarNome(data.name)
        pSpecies.innerText = validarGenus(data.genera);
        pNumber.innerText = `#${pokeNumber.padStart(4, "0")}`
        pImage.setAttribute("src", imgURL)
        

     })
     .catch(err => console.log(err))
})



