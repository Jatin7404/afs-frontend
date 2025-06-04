import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Webcam from "react-webcam";

function InterviewQuestions() {
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (difficulty) {
      loadQuestions();
    }
  }, [difficulty]);

  const loadQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://afs-backend-x5k5.onrender.com/api/interview/${difficulty}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(response.data);
      setCurrentQuestion(null);
    } catch (err) {
      setError("Failed to load questions");
    }
  };

  const handleStartRecording = async () => {
    setRecordedChunks([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      webcamRef.current.video.srcObject = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();

      setRecording(true);
    } catch (err) {
      setError("Failed to access camera");
    }
  };

  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleSaveRecording = async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "https://afs-backend-x5k5.onrender.com/api/interview/recording",
          {
            questionId: currentQuestion._id,
            videoUrl: url,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRecordedChunks([]);
        setCurrentQuestion(null);
      } catch (err) {
        setError("Failed to save recording");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Interview Practice
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Difficulty
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4"
        >
          <option value="">Choose difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {questions.length > 0 && !currentQuestion && (
        <div className="grid gap-6">
          {questions.map((question) => (
            <div key={question._id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {question.question}
              </h3>
              <button
                onClick={() => setCurrentQuestion(question)}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Practice This Question
              </button>
            </div>
          ))}
        </div>
      )}

      {currentQuestion && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentQuestion.question}
          </h2>

          <div className="aspect-w-16 aspect-h-9 mb-4">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              className="rounded-lg"
            />
          </div>

          <div className="flex space-x-4">
            {!recording && (
              <button
                onClick={handleStartRecording}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Start Recording
              </button>
            )}

            {recording && (
              <button
                onClick={handleStopRecording}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Stop Recording
              </button>
            )}

            {recordedChunks.length > 0 && (
              <button
                onClick={handleSaveRecording}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Recording
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewQuestions;
