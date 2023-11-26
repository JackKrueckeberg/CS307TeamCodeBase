// SimilarSearches.js
import React from 'react';

const SimilarSearches = ({ suggestions, onSuggestionClick }) => {
  console.log('Suggestions:', suggestions);

  if (suggestions.length === 0) {
    console.log('No suggestions.');
    return null;
  }

  return (
    <div className="similar-searches">
      <p>Did you mean:</p>
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index}>
            <button onClick={() => onSuggestionClick(suggestion)}>
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimilarSearches;
