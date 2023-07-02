import { useState, useEffect } from 'react';
import './index.css';
import Die from './Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = useState(allNewDiceArray());
  const [rolls, setRolls] = useState(0);
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      let highScore;
      if (!localStorage.getItem('highScore')) {
        highScore = rolls;
        localStorage.setItem('highScore', highScore.toString());
      } else if (rolls < +localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', rolls.toString());
      }
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDiceArray() {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(generateNewDie());
    }
    return arr;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRolls((prev) => prev + 1);
    } else {
      setTenzies(false);
      setDice(allNewDiceArray);
      setRolls(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <>
      <div className='container'>
        {tenzies && <Confetti />}
        <div className='main'>
          <h1>Tenzies</h1>
          {tenzies ? (
            <h1>Great job! 🎉</h1>
          ) : (
            <p className='rules'>
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </p>
          )}
          <div className='dice-container'>{diceElements}</div>
          <div className='btn' onClick={rollDice}>
            {tenzies ? 'New Game' : 'Roll 🎲'}
          </div>
        </div>
      </div>
      <div className='score'>
        <div className='current'>
          <p>Current Rolls</p>
          <p>{rolls}</p>
        </div>
        <div className='high-score'>
          <p>Best Game</p>
          <p>{localStorage.getItem('highScore')}</p>
        </div>
      </div>
    </>
  );
}
