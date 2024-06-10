const topContainer = document.querySelector(".topContainer"),
    textInput = document.getElementById("textInput"),
    textInputCotainer = document.querySelector(".textInput__container"),
    jumbledSentenceContainer = document.querySelector(".jumbledSentence__wrapper"),
    modeByChunkInput = document.getElementById("byChunk"),
    mainButtons = document.querySelector(".mainActionButtons__wrapper"),
    secondaryButtons = document.querySelector(".secondaryActionButtons")

let correctOrderArray;
let checkingModeByChunk = true

function handleInput(){
    const bySentneceArray = textInput.value.trim().split('\n')
    const byWordArray = bySentneceArray.map(sentence => sentence.split(' '))

    correctOrderArray = byWordArray.map(anArray =>anArray.filter(word => word).map(word=>word.replace(/\+/g, ' ')))
}

function jumbleWords(inputList){
    return inputList.sort(() => Math.random() - 0.5)
}

// function makeDraggable(){
//     const sentences = document.getElementsByClassName("jumbledSentence")
//     console.log(sentences)
//     Array.from(sentences).forEach(el => {dragula([el])})
// }

function makeDraggable(){
    const sentences = document.getElementsByClassName("jumbledSentence")
    console.log(sentences)
    for( let i=0; i<sentences.length; i++){
        dragula([sentences[i]])
    }
    // Array.from(sentences).forEach(el => {dragula([el])})
}

function selectMode(){
    modeByChunkInput.checked  ? checkingModeByChunk = true : checkingModeByChunk = false
    clearStyles()
}

function clearStyles(){
    const allChunks = document.getElementsByClassName("jumbledSentence__chunk")

    for(let i=0;i<allChunks.length;i++){
        allChunks[i].classList.remove("jumbledSentence__chunk--wrong")
        allChunks[i].classList.remove("jumbledSentence__chunk--correct")
    }

    const allSentences = document.getElementsByClassName("jumbledSentence")

    for(let i=0;i<allSentences.length;i++){
        allSentences[i].classList.remove("jumbledSentence--correct")
        allSentences[i].classList.remove("jumbledSentence--wrong")
    }

}

function makeChunks(){
    jumbledSentenceContainer.innerHTML=""

    handleInput()
    //Create a deep copy of array with arrays with chunks in the correct order
    const jumbledWordsArray = correctOrderArray.map(subarray => [...subarray])

    jumbledWordsArray.forEach((sentence, index) =>{
        const sentenceStrucutre = document.createElement('div')
        sentenceStrucutre.classList.add('jumbledSentence__container')

        const sentenceElement = document.createElement('div')
        sentenceElement.classList.add('jumbledSentence')
        sentenceElement.setAttribute("id", index)

        sentenceStrucutre.appendChild(sentenceElement) 

        const jumbledSentence = jumbleWords(sentence)

        jumbledSentence.forEach(chunk => {
            const chunkElement = `<div class='jumbledSentence__chunk'>${chunk}</div>`
            sentenceElement.insertAdjacentHTML("beforeend", chunkElement)
        })
    
        const checkButton = `<button class='buttonGeneral buttonGeneral__inline' data-index=${index}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="checkmark"><g data-name="Layer 2"><g data-name="checkmark-square"><path d="M20 11.83a1 1 0 0 0-1 1v5.57a.6.6 0 0 1-.6.6H5.6a.6.6 0 0 1-.6-.6V5.6a.6.6 0 0 1 .6-.6h9.57a1 1 0 1 0 0-2H5.6A2.61 2.61 0 0 0 3 5.6v12.8A2.61 2.61 0 0 0 5.6 21h12.8a2.61 2.61 0 0 0 2.6-2.6v-5.57a1 1 0 0 0-1-1z"></path><path d="M10.72 11a1 1 0 0 0-1.44 1.38l2.22 2.33a1 1 0 0 0 .72.31 1 1 0 0 0 .72-.3l6.78-7a1 1 0 1 0-1.44-1.4l-6.05 6.26z"></path></g></g></svg></button>`
        sentenceStrucutre.insertAdjacentHTML("beforeend", checkButton)

        

        secondaryButtons.classList.remove("secondaryActionButtons--hidden")
        mainButtons.classList.add("mainActionButtons__wrapper--hidden")
        textInputCotainer.classList.add("textInput__container--minimized")

        setTimeout(() => {
            textInputCotainer.classList.add("textInput__container--hidden")
            topContainer.classList.remove("topContainer--hidden")
            jumbledSentenceContainer.appendChild(sentenceStrucutre)
            makeDraggable()
            addSingleSentenceCheck()

          }, 400);
    })
      


}

function returnInput(){
    textInputCotainer.classList.remove("textInput__container--minimized")
    topContainer.classList.add("topContainer--hidden")
    setTimeout(()=>{
        textInputCotainer.classList.remove("textInput__container--hidden")
        mainButtons.classList.remove("mainActionButtons__wrapper--hidden")
    },400)
    
}

function checkSentenceChunkByChunk (singleSentenceCollection, sentenceIndex){
    for( let chunkIndex=0; chunkIndex<singleSentenceCollection.length; chunkIndex++){
        if(singleSentenceCollection[chunkIndex].innerText === correctOrderArray[sentenceIndex][chunkIndex]){
            singleSentenceCollection[chunkIndex].classList.remove("jumbledSentence__chunk--wrong")
            singleSentenceCollection[chunkIndex].classList.add("jumbledSentence__chunk--correct")
        }
        else{
            singleSentenceCollection[chunkIndex].classList.remove("jumbledSentence__chunk--correct")
            singleSentenceCollection[chunkIndex].classList.add("jumbledSentence__chunk--wrong")
        }
    }
}

function checkSentenceAsWhole(singleSentenceCollection, sentenceIndex){
    console.log(singleSentenceCollection)
    const chunksStringified =  Array.from(singleSentenceCollection).map(item => item.innerText).toString()
    if(chunksStringified === correctOrderArray[sentenceIndex].toString()){
        singleSentenceCollection[0].parentElement.classList.remove("jumbledSentence--wrong")
        singleSentenceCollection[0].parentElement.classList.add("jumbledSentence--correct")
    }
    else{
        singleSentenceCollection[0].parentElement.classList.remove("jumbledSentence--correct")
        singleSentenceCollection[0].parentElement.classList.add("jumbledSentence--wrong")
    }
}

function checkAllSentences(){
    const collectionOfAnsweredSentences = document.getElementsByClassName("jumbledSentence")
    for(let sentenceIndex=0; sentenceIndex<collectionOfAnsweredSentences.length; sentenceIndex++){
        const singleSentenceAnswered = collectionOfAnsweredSentences[sentenceIndex].children
        checkingModeByChunk ? checkSentenceChunkByChunk(singleSentenceAnswered, sentenceIndex) : checkSentenceAsWhole(singleSentenceAnswered, sentenceIndex)

    }  
}

function addSingleSentenceCheck(){

    const collectionOfButtons = document.getElementsByClassName("buttonGeneral__inline")
    
    for(let i=0; i<collectionOfButtons.length; i++){
        const buttonIndex=collectionOfButtons[i].dataset.index
        const collectionToCheck = document.getElementById(buttonIndex).children
        collectionOfButtons[i].addEventListener('click', () => checkingModeByChunk ? checkSentenceChunkByChunk(collectionToCheck, buttonIndex) : checkSentenceAsWhole(collectionToCheck, buttonIndex))
    }
}

function changeFontSize(amount=2){
    const curretnFontSize = getComputedStyle(jumbledSentenceContainer).getPropertyValue('--font-size-changable').replace(/\D/g,'')
    const newFontSize = +curretnFontSize + amount +"px"
    jumbledSentenceContainer.style.setProperty('--font-size-changable', newFontSize);
}