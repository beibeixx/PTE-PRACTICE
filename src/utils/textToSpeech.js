export const speakText = (text) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;  // speed
    window.speechSynthesis.speak(utterance);
    
    return utterance;
  };
  
  export const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };