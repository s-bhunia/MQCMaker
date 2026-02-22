import React, { useState } from "react";
import QuestionForm from "./components/QuestionForm";
import TestPaper from "./components/TestPaper";
import { generateQuestions } from "./components/geminiService";

const App = () => {
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setCurrentTopic(formData.topic);
    try {
      const result = await generateQuestions(
        formData.topic,
        formData.count,
        formData.type,
        formData.hardness,
      );
      setQuestions(result);
    } catch (error) {
      alert("Failed to generate questions. Check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setQuestions(null);
    setCurrentTopic("");
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {!questions ? (
        <QuestionForm onSubmit={handleGenerate} isLoading={isLoading} />
      ) : (
        <TestPaper
          questions={questions}
          topic={currentTopic}
          onReset={resetApp}
        />
      )}
    </div>
  );
};

export default App;
