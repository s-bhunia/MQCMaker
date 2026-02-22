import React, { useState } from "react";

const TestPaper = ({ questions, topic, onReset }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) return null;

  const handleSelect = (questionId, option) => {
    // Prevent changing answers after validation
    if (isValidated) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleValidate = () => {
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      const qId = q.id || index;
      if (selectedAnswers[qId] === q.answer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setIsValidated(true);
    setShowAnswers(true); // Auto-show correct answers upon validation
  };

  return (
    <div style={paperStyle}>
      {/* Header section */}
      <div style={headerStyle}>
        <h2 style={{ margin: "0 0 15px 0" }}>Test Paper: {topic}</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setShowAnswers(!showAnswers)} style={btnStyle}>
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </button>
          <button
            onClick={onReset}
            style={{ ...btnStyle, backgroundColor: "#dc3545", color: "white" }}
          >
            New Test
          </button>
        </div>
      </div>

      {/* Questions mapping */}
      {questions.map((q, index) => {
        const qId = q.id || index;
        const userAnswer = selectedAnswers[qId];
        const isCorrect = userAnswer === q.answer;

        return (
          <div key={qId} style={{ marginBottom: "30px" }}>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1.1em",
                lineHeight: "1.4",
              }}
            >
              {index + 1}. {q.question}
            </p>

            {/* Render MCQ Radio Buttons */}
            {q.options && q.options.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  paddingLeft: "10px",
                }}
              >
                {q.options.map((opt, i) => {
                  let optionStyle = {
                    padding: "8px",
                    borderRadius: "4px",
                    transition: "background 0.2s",
                  };

                  // Validation highlighting logic
                  if (isValidated) {
                    if (opt === q.answer) {
                      optionStyle.backgroundColor = "#d4edda"; // Green for correct answer
                      optionStyle.border = "1px solid #c3e6cb";
                    } else if (opt === userAnswer && !isCorrect) {
                      optionStyle.backgroundColor = "#f8d7da"; // Red for wrong user choice
                      optionStyle.border = "1px solid #f5c6cb";
                    }
                  }

                  return (
                    <label
                      key={i}
                      style={{
                        ...optionStyle,
                        display: "flex",
                        alignItems: "center",
                        cursor: isValidated ? "default" : "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${qId}`}
                        value={opt}
                        checked={userAnswer === opt}
                        onChange={() => handleSelect(qId, opt)}
                        disabled={isValidated}
                        style={{
                          marginRight: "10px",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <span style={{ fontSize: "1rem" }}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              /* Fallback for SAQ (Short Answer Questions) */
              <textarea
                placeholder="Type your answer here..."
                disabled={isValidated}
                style={{
                  width: "100%",
                  padding: "10px",
                  boxSizing: "border-box",
                  minHeight: "80px",
                  marginTop: "10px",
                }}
                onChange={(e) => handleSelect(qId, e.target.value)}
              />
            )}

            {/* Answer Display (Toggled or Validated) */}
            {showAnswers && (
              <div style={answerBoxStyle}>
                <strong>Correct Answer:</strong> {q.answer}
              </div>
            )}
          </div>
        );
      })}

      {/* Footer Validation Section */}
      <div style={footerStyle}>
        {!isValidated ? (
          <button
            onClick={handleValidate}
            style={{
              ...btnStyle,
              backgroundColor: "#007bff",
              color: "white",
              fontSize: "1.1em",
              padding: "12px 24px",
            }}
          >
             Validate Answers
          </button>
        ) : (
          <div
            style={{
              fontSize: "1.3em",
              fontWeight: "bold",
              color: score > questions.length / 2 ? "#28a745" : "#dc3545",
            }}
          >
            You scored {score} out of {questions.length} ({" "}
            {Math.round((score / questions.length) * 100)}% )
          </div>
        )}
      </div>
    </div>
  );
};

// Fluid, responsive styles
const paperStyle = {
  width: "100%",
  maxWidth: "800px",
  margin: "20px auto", // Reduced margin for mobile
  padding: "5%", // Percentage padding scales down on mobile
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  color: "#222",
  fontFamily: "serif",
  boxSizing: "border-box",
  borderRadius: "8px",
};

const headerStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap", // Allows buttons to drop below title on small screens
  borderBottom: "2px solid #333",
  paddingBottom: "15px",
  marginBottom: "25px",
};

const footerStyle = {
  marginTop: "40px",
  paddingTop: "20px",
  borderTop: "2px solid #eee",
  display: "flex",
  justifyContent: "center",
};

const btnStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f8f9fa",
  fontWeight: "bold",
  transition: "all 0.2s",
};

const answerBoxStyle = {
  marginTop: "15px",
  padding: "12px",
  backgroundColor: "#eefef2",
  borderLeft: "4px solid #28a745",
  borderRadius: "0 4px 4px 0",
};

export default TestPaper;
