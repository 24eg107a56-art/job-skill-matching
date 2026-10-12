import React from 'react';
import { Target } from 'lucide-react';

const MatchIndicator = ({ score = 0, showLabel = true, size = 'medium' }) => {
  const numericScore = Math.round(score);

  let statusClass = 'match-low';
  if (numericScore >= 75) statusClass = 'match-high';
  else if (numericScore >= 50) statusClass = 'match-medium';

  return (
    <div className={`match-score-pill ${statusClass}`} style={{
      fontSize: size === 'large' ? '1rem' : size === 'small' ? '0.75rem' : '0.85rem',
      padding: size === 'large' ? '0.45rem 1rem' : size === 'small' ? '0.2rem 0.55rem' : '0.3rem 0.75rem',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <Target size={size === 'large' ? 18 : size === 'small' ? 13 : 15} />
      <span>{numericScore}% {showLabel && 'Match'}</span>
    </div>
  );
};

export default MatchIndicator;
