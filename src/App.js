import React, { useState, useEffect } from "react";
import { rsSentences } from "./data/rs-sentences";
import { wfdSentences } from "./data/wfd-sentences";
import { processData } from "./utils/dataProcessor";
import { speakText, stopSpeaking } from "./utils/textToSpeech";
import "./App.css";

const App = () => {
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("rs"); // 'all', 'rs', or 'wfd'
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    stopSpeaking();
    setIsPlaying(false);
  }, [currentIndex, currentCategory]);

  useEffect(() => {
    const processedSentences = processData(rsSentences, wfdSentences);
    setSentences(processedSentences);
  }, []);

  const filteredSentences = sentences.filter(
    (sentence) => sentence.category === currentCategory
  );

  const currentSentence = filteredSentences[currentIndex] || {};

  const handlePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      if (currentSentence && currentSentence.text) {
        const utterance = speakText(currentSentence.text);
        setIsPlaying(true);

        utterance.onend = () => {
          setIsPlaying(false);
        };
      }
    }
  };

  const handleCheck = () => {
    setShowDiff(true);
  };

  const handleNext = () => {
    if (currentIndex < filteredSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setShowDiff(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserInput("");
      setShowDiff(false);
    }
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentIndex(0);
    setUserInput("");
    setShowDiff(false);
  };

  const showAnswer = () => {
    return (
      <div className="comparison-content">
        <div className="original-text">{currentSentence.text}</div>
      </div>
    );
  };

  const compareSentences = () => {
    const original = currentSentence.text
      .replace(/[.,!;:-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");
    const input = userInput
      .trim()
      .replace(/[.,!;:-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");

    const originalWordCount = {};
    original.forEach((word) => {
      const lowercaseWord = word.toLowerCase();
      originalWordCount[lowercaseWord] =
        (originalWordCount[lowercaseWord] || 0) + 1;
    });

    const inputWordCount = {};
    input.forEach((word) => {
      const lowercaseWord = word.toLowerCase();
      inputWordCount[lowercaseWord] = (inputWordCount[lowercaseWord] || 0) + 1;
    });

    let correctWord = 0;

    return (
      <div className="comparison-content">
        <div className="word-by-word">
          <span>Answer:</span>
          {original.map((word, index) => {
            return (
              <span key={index} className={"word correct"}>
                {word}
              </span>
            );
          })}
        </div>
        <div className="word-by-word">
          <span>Submitted:</span>
          {input.map((word, index) => {
            const lowercaseWord = word.toLowerCase();
            const isCorrect = (originalWordCount[lowercaseWord] || 0) > 0;
            if (isCorrect) {
              originalWordCount[lowercaseWord]--;
              correctWord++;
            }
            return (
              <span
                key={index}
                className={`word ${isCorrect ? "correct" : "incorrect"}`}
              >
                {word}
              </span>
            );
          })}
        </div>
        <div>
          <span>
            Score: {correctWord} / {original.length}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="info-container">
        <h2 className="main-title">PTE Practice</h2>

        <div className="category">
          <button
            onClick={() => handleCategoryChange("rs")}
            className={`px-4 py-2 rounded ${
              currentCategory === "rs"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            RS
          </button>
          <button
            onClick={() => handleCategoryChange("wfd")}
            className={`px-4 py-2 rounded ${
              currentCategory === "wfd"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            WFD
          </button>
        </div>

        <div className="progress-info">
          <span className="progress-text">Progress:</span> {currentIndex + 1} /{" "}
          {filteredSentences.length}
        </div>
      </div>

      <div className="audio">
        <button
          onClick={handlePlay}
          className={`audio button ${isPlaying ? "playing" : ""}`}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>

      {currentCategory === "wfd" && (
        <div className="answer">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="answer-box"
            placeholder="Type the sentence here..."
            rows="3"
          />
        </div>
      )}

      <div className="control">
        {currentCategory === "wfd" ? (
          <button onClick={handleCheck} className="check">
            Check
          </button>
        ) : (
          <button onClick={handleCheck} className="check">
            Show Answer
          </button>
        )}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="prev"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredSentences.length - 1}
          className="next"
        >
          Next
        </button>
      </div>

      {showDiff && (
        <div className="difference">
          <div className="difference-text">
            {currentCategory === "wfd" ? `Comparison:` : `Answer`}
          </div>
          <div>
            {currentCategory === "wfd" ? compareSentences() : showAnswer()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
