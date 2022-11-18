import { useCallback, useEffect, useState } from "react"
import Drawing from "./Drawing"
import Keyboard from "./Keyboard"
import Word from "./Word"
import words from './words.json'

function getWord(){
   return words[Math.floor(Math.random()*words.length)]
}
function App() {
  const [wordsToguess,setWordsToGuess] = useState(getWord)
  const [guessedLetters,setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(
    letter=>!wordsToguess.includes(letter))

    const isLoser = incorrectLetters.length >= 6
    const isWinner = wordsToguess.split("").every(letter=>
      guessedLetters.includes(letter))
  const addGuessedLetter = useCallback((letter:string)=>{
    if(guessedLetters.includes(letter) || isWinner || isLoser) return

    setGuessedLetters(currentLetters => [...currentLetters,letter])
    },[guessedLetters,isWinner,isLoser])
  

  useEffect(()=>{
    const handler = (e:KeyboardEvent) =>{
      const key = e.key
      if(!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)
    }
    document.addEventListener("keypress",handler)
    return () =>{
      document.removeEventListener("keypress",handler)
    }
  },[guessedLetters])

   useEffect(()=>{
    const handler = (e:KeyboardEvent) =>{
      const key = e.key
      if(key !== "Enter") return
      e.preventDefault()
      setGuessedLetters([])
      setWordsToGuess(getWord())
    }
    document.addEventListener("keypress",handler)
    return () =>{
      document.removeEventListener("keypress",handler)
    }
  },[guessedLetters])
  return (
    <div
    style={{
      maxWidth:"800px",
      display:"flex",
      flexDirection:"column",
      gap:"2rem",
      margin:"0 auto",
      alignItems:"center"
    }}
    >
      <div style={{fontSize:"2rem", textAlign:"center"}}>
        {isWinner && "You win"}
        {isLoser && "You Lose"}
      </div>
      <Drawing numberOfGuesses={incorrectLetters.length}/>
      <Word reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordsToguess}/>
      <div style={{alignSelf:"stretch"}}>
      <Keyboard disabled={isWinner || isLoser} activeLetter={guessedLetters.filter(letter=>
        wordsToguess.includes(letter))}
        inactiveletters={incorrectLetters}
        addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App
