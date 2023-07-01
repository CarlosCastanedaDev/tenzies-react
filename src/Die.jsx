import React from 'react';
import './index.css';

export default function Die({ value, isHeld, holdDice }) {
  const styles = { backgroundColor: isHeld ? '#2261de' : 'white' };
  const num = { color: isHeld ? 'white' : 'black' };
  return (
    <div className='die-container' style={styles} onClick={holdDice}>
      <div style={num}>{value}</div>
    </div>
  );
}
