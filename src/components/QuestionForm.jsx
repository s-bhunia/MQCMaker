import React, { useState } from "react";
import topicsData from "../assets/topic.json";

const QuestionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    count: 15,
    type: "MCQ",
    hardness: "Medium",
  });

  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [topicSuggestions, setTopicSuggestions] = useState([]);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [countError, setCountError] = useState("");

  // --- LOGIC SECTION (Preserved) ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "count") {
      const numValue = parseInt(value) || 0;
      if (numValue > 20) {
        setCountError("AUKAT MAIN RAHO! ");
      } else {
        setCountError("");
      }
    }

    setFormData({ ...formData, [name]: value });

    if (name === "subject") {
      if (value.trim().length > 0) {
        const allSubjects = Object.keys(topicsData);
        const filtered = allSubjects.filter((subject) =>
          subject.toLowerCase().includes(value.toLowerCase()),
        );
        setSubjectSuggestions(filtered);
        setShowSubjectSuggestions(true);
      } else {
        setSubjectSuggestions([]);
        setShowSubjectSuggestions(false);
      }
    } else if (name === "topic") {
      if (value.trim().length > 0) {
        const topicsForSubject =
          formData.subject && topicsData[formData.subject]
            ? topicsData[formData.subject]
            : Object.values(topicsData).flat();

        const filtered = topicsForSubject.filter((topic) =>
          topic.toLowerCase().includes(value.toLowerCase()),
        );
        setTopicSuggestions(filtered.slice(0, 5));
        setShowTopicSuggestions(true);
      } else {
        setTopicSuggestions([]);
        setShowTopicSuggestions(false);
      }
    }
  };

  const handleSubjectClick = (suggestion) => {
    setFormData({ ...formData, subject: suggestion });
    setSubjectSuggestions([]);
    setShowSubjectSuggestions(false);
  };

  const handleTopicClick = (suggestion) => {
    setFormData({ ...formData, topic: suggestion });
    setTopicSuggestions([]);
    setShowTopicSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (countError) {
      alert("Please fix the validation errors");
      return;
    }
    onSubmit(formData);
  };

  // --- RENDER SECTION ---
  return (
    <>
      {/* Internal CSS for hover/focus states that inline styles can't handle */}
      <style>
        {`
          .modern-input {
            width: 100%;
            padding: 12px 16px;
            margin-top: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background-color: #f8fafc;
            font-size: 15px;
            transition: all 0.2s ease;
            box-sizing: border-box;
            outline: none;
            color: #334155;
          }
          .modern-input:focus {
            background-color: #ffffff;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          }
          .modern-input.error {
            border-color: #ef4444;
            background-color: #fef2f2;
          }
          .modern-input.error:focus {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }
          .modern-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 4px;
          }
          .error-text {
            color: #ef4444;
            font-size: 13px;
            margin-top: 6px;
            font-weight: 500;
          }
          .suggestion-item {
            padding: 10px 16px;
            cursor: pointer;
            color: #475569;
            font-size: 14px;
            transition: background 0.15s;
          }
          .suggestion-item:hover {
            background-color: #eff6ff;
            color: #6366f1;
          }
          .submit-btn {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            border: none;
            padding: 14px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.1s, box-shadow 0.2s;
            margin-top: 10px;
          }
          .submit-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }
          .submit-btn:active {
            transform: translateY(0);
          }
          .submit-btn:disabled {
            background: #cbd5e1;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>MCQMaker</h1>
          <p style={subtitleStyle}>Configure your perfect test</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Subject Field */}
          <div style={fieldGroupStyle}>
            <label className="modern-label">
              Subject{" "}
              <span style={{ fontWeight: 400, color: "#94a3b8" }}>
                (Optional)
              </span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                name="subject"
                className="modern-input"
                placeholder="e.g. Physics, History..."
                value={formData.subject}
                onChange={handleChange}
                onFocus={() =>
                  formData.subject && setShowSubjectSuggestions(true)
                }
                onBlur={() =>
                  setTimeout(() => setShowSubjectSuggestions(false), 200)
                }
                autoComplete="off"
              />
              {showSubjectSuggestions && subjectSuggestions.length > 0 && (
                <ul style={dropdownStyle}>
                  {subjectSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSubjectClick(suggestion)}
                      className="suggestion-item"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Topic Field */}
          <div style={fieldGroupStyle}>
            <label className="modern-label">Topic</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                name="topic"
                className="modern-input"
                placeholder={
                  formData.subject
                    ? `Search in ${formData.subject}...`
                    : "Search any topics..."
                }
                value={formData.topic}
                onChange={handleChange}
                onFocus={() => formData.topic && setShowTopicSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowTopicSuggestions(false), 200)
                }
                required
                autoComplete="off"
              />
              {showTopicSuggestions && topicSuggestions.length > 0 && (
                <ul style={dropdownStyle}>
                  {topicSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleTopicClick(suggestion)}
                      className="suggestion-item"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={rowStyle}>
            {/* Count Field */}
            <div style={{ flex: 1 }}>
              <label className="modern-label">Questions</label>
              <input
                type="number"
                name="count"
                min="1"
                max="20"
                className={`modern-input ${countError ? "error" : ""}`}
                value={formData.count}
                onChange={handleChange}
              />
              {countError && <div className="error-text">{countError}</div>}
            </div>

            {/* Hardness Field */}
            <div style={{ flex: 1 }}>
              <label className="modern-label">Difficulty</label>
              <select
                name="hardness"
                className="modern-input"
                value={formData.hardness}
                onChange={handleChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Type Field */}
          <div style={fieldGroupStyle}>
            <label className="modern-label">Question Type</label>
            <div style={radioGroupStyle}>
              {["MCQ", "SAQ"].map((type) => (
                <label
                  key={type}
                  style={radioLabelStyle(formData.type === type)}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    style={{ marginRight: "8px" }}
                  />
                  {type === "MCQ" ? "Multiple Choice" : "Short Answer"}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || countError}
            className="submit-btn"
          >
            {isLoading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                Generating...
              </span>
            ) : (
              "Generate Test Paper"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

// --- STYLES OBJECTS ---

const containerStyle = {
  maxWidth: "480px",
  margin: "60px auto",
  padding: "40px",
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
  border: "1px solid #f1f5f9",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px",
};

const titleStyle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "800",
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
};

const subtitleStyle = {
  margin: "8px 0 0 0",
  color: "#64748b",
  fontSize: "15px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const rowStyle = {
  display: "flex",
  gap: "15px",
};

const dropdownStyle = {
  position: "absolute",
  top: "calc(100% + 5px)",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  border: "1px solid #e2e8f0",
  listStyle: "none",
  margin: 0,
  padding: "5px 0",
  maxHeight: "220px",
  overflowY: "auto",
  zIndex: 50,
};

const radioGroupStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "8px",
};

const radioLabelStyle = (isActive) => ({
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: `1px solid ${isActive ? "#6366f1" : "#e2e8f0"}`,
  backgroundColor: isActive ? "#eef2ff" : "#fff",
  color: isActive ? "#4338ca" : "#64748b",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
});

export default QuestionForm;
