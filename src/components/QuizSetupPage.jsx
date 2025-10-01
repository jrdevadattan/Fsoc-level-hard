import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

const QuizSetupPage = ({ onStart }) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [category, setCategory] = useState(null); // { id, name }
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionType, setQuestionType] = useState("multiple"); // API values: multiple/boolean
  const [categories, setCategories] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const difficultyOptions = ["Easy", "Medium", "Hard"];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setError(null);
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.trivia_categories || []);
        if (data.trivia_categories?.length > 0) {
          setCategory({
            id: data.trivia_categories[0].id,
            name: data.trivia_categories[0].name,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Initialize question types
  useEffect(() => {
    setLoadingTypes(true);
    try {
      const types = [
        { value: "multiple", label: "Multiple Choice" },
        { value: "boolean", label: "True/False" },
      ];
      setQuestionTypes(types);
      setQuestionType(types[0].value);
    } catch (err) {
      console.error("Failed to set question types", err);
    } finally {
      setLoadingTypes(false);
    }
  }, []);

  // Start quiz and save preferences
  const handleStartQuiz = () => {
    const preferences = { numQuestions, category, difficulty, questionType };
    localStorage.setItem("quizPreferences", JSON.stringify(preferences));
    console.log("Quiz started with config:", preferences);

    if (typeof onStart === "function") {
      onStart(); // tells QuizApp to start quiz
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-6xl">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-6 text-white">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Quiz Setup</h1>
            <p className="text-gray-400 text-sm">
              Configure your quiz preferences and start playing
            </p>
          </div>

          {/* Number of Questions */}
          <div className="mb-6">
            <label className="block font-medium mb-3">
              Number of Questions: {numQuestions}
            </label>
            <RangeSlider
              value={numQuestions}
              onChange={setNumQuestions}
              min={5}
              max={50}
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Category</label>
            {loadingCategories ? (
              <div className="text-gray-400">Loading categories...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <Dropdown
                id="category"
                value={category?.name || ""}
                onChange={setCategory}
                options={categories.map((c) => ({ id: c.id, name: c.name }))}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                renderLabel={(opt) => opt.name}
              />
            )}
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Difficulty</label>
            <Dropdown
              id="difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={difficultyOptions}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
          </div>

          {/* Question Type */}
          <div className="mb-8">
            <label className="block font-medium mb-3">Question Type</label>
            {loadingTypes ? (
              <div className="text-gray-400">Loading question types...</div>
            ) : (
              <Dropdown
                id="type"
                value={
                  questionTypes.find((t) => t.value === questionType)?.label ||
                  ""
                }
                onChange={(option) => {
                  if (typeof option === "string") {
                    const found = questionTypes.find((t) => t.label === option);
                    if (found) setQuestionType(found.value);
                  } else if (option?.value) {
                    setQuestionType(option.value);
                  }
                }}
                options={questionTypes}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                renderLabel={(opt) => opt.label}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleStartQuiz}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 py-4 rounded-xl font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Quiz
            </button>

            <button className="bg-gray-700 text-white py-4 px-12 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-colors">
              <FontAwesomeIcon icon={faTrophy} className="w-6 h-6" />
            </button>
          </div>

          {/* Preview of selected settings */}
          <QuickSettings
            numQuestions={numQuestions}
            category={category}
            difficulty={difficulty}
            questionType={questionType}
          />
        </div>
      </div>
    </div>
  );
};

/* ===== Sub-components ===== */
const RangeSlider = ({ value, onChange, min, max }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${percentage}%, #3a4553 ${percentage}%, #3a4553 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: black;
          border: 3px solid #8b5cf6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: black;
          border: 3px solid #8b5cf6;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

const Dropdown = ({
  id,
  value,
  onChange,
  options,
  openDropdown,
  setOpenDropdown,
  renderLabel,
}) => {
  const isOpen = openDropdown === id;
  return (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(isOpen ? null : id)}
        className="w-full bg-gray-700 px-4 py-3 rounded-xl text-left flex items-center justify-between hover:bg-opacity-80 transition-colors"
      >
        <span>{value}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-700 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
          {options.map((option, index) => {
            const label = renderLabel
              ? renderLabel(option)
              : typeof option === "string"
              ? option
              : option.label || option.name || JSON.stringify(option);
            return (
              <button
                key={index}
                onClick={() => {
                  onChange(option);
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const QuickSettings = ({ numQuestions, category, difficulty, questionType }) => {
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-red-400";
      default:
        return "text-white";
    }
  };

  const getShortType = (type) => (type === "multiple" ? "MC" : type === "boolean" ? "TF" : "MX");

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-5 gap-3 w-full max-w-5xl">
        {/* Number of Questions */}
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 text-center flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">{numQuestions}</div>
          <div className="text-xs text-gray-300">Questions</div>
        </div>

        {/* Category (full name, spans 2 columns) */}
        <div className="col-span-2 bg-gray-700 border border-gray-600 rounded-xl p-4 text-center flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{category?.name || ""}</div>
          <div className="text-xs text-gray-300">Category</div>
        </div>

        {/* Difficulty */}
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 text-center flex flex-col items-center justify-center">
          <div className={`text-2xl font-bold mb-1 ${getDifficultyColor(difficulty)}`}>{difficulty}</div>
          <div className="text-xs text-gray-300">Difficulty</div>
        </div>

        {/* Question Type */}
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 text-center flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-cyan-400 mb-1">{getShortType(questionType)}</div>
          <div className="text-xs text-gray-300">Type</div>
        </div>
      </div>
    </div>
  );
};


export default QuizSetupPage;
