console.log("Home rendering");
import { useState } from "react";
import { createCourse } from "../api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    const res = await createCourse(subject);
    localStorage.setItem("course", JSON.stringify(res.data));
    navigate("/course");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Academix</h1>
      <input
        type="text"
        placeholder="Enter skill to learn (e.g., Python Basics)"
        className="border p-2 w-full max-w-md"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !subject}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating Course..." : "Start Learning"}
      </button>
    </div>
  );
}
