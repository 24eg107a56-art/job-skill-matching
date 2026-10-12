import React from 'react';
import { Check, X, Tag } from 'lucide-react';

const SkillBadge = ({ name, type = 'neutral', size = 'normal' }) => {
  let badgeClass = 'badge-neutral';
  let Icon = Tag;

  if (type === 'matched') {
    badgeClass = 'badge-matched';
    Icon = Check;
  } else if (type === 'missing') {
    badgeClass = 'badge-missing';
    Icon = X;
  } else if (type === 'primary') {
    badgeClass = 'badge-primary';
    Icon = Tag;
  }

  return (
    <span className={`badge ${badgeClass}`} style={{
      fontSize: size === 'small' ? '0.725rem' : '0.8rem',
      padding: size === 'small' ? '0.2rem 0.5rem' : '0.28rem 0.65rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      textTransform: 'none'
    }}>
      <Icon size={size === 'small' ? 12 : 14} />
      <span>{name}</span>
    </span>
  );
};

export default SkillBadge;
