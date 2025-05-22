import { ChangeEvent, useState, useEffect } from "react";
import ReactIcon from "../assets/React-icon.webp";
import { backend } from "../../declarations/backend";
import "./styles/App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [name, setName] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [count, setCount] = useState<bigint>(BigInt(0));
  const [prompt, setPrompt] = useState<string>("");
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [llmLoading, setLlmLoading] = useState(false);

  const fetchGreeting = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const res = await backend.greet(name || "World");
      setResponse(res);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const res = await backend.get_count();
      setCount(res);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const incrementCounter = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const res = await backend.increment();
      setCount(res);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (
    event: ChangeEvent<HTMLInputElement> | undefined,
  ): void => {
    if (!event?.target.value) {
      return;
    }
    setName(event.target.value);
  };

  const handleChangePrompt = (
    event: ChangeEvent<HTMLTextAreaElement> | undefined,
  ): void => {
    if (!event?.target.value) {
      return;
    }
    setPrompt(event.target.value);
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    try {
      setLlmLoading(true);
      setError(undefined);
      const res = await backend.prompt(prompt);
      setLlmResponse(res);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLlmLoading(false);
    }
  };

  // Fetch the initial count when component mounts
  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={ReactIcon} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vibe Coding Template</h1>
      <h2>React + Rust + Internet Computer</h2>

      <div className="card">
        <h3>Greeting</h3>
        <input
          type="text"
          onChange={handleChangeText}
          value={name}
          placeholder="Enter your name"
          className="focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={fetchGreeting}
          disabled={loading}
          className="hover:border-blue-400"
        >
          Get Greeting
        </button>
        {!!response && <div className="response">{response}</div>}
      </div>

      <div className="card">
        <h3>Counter: {count.toString()}</h3>
        <button
          onClick={incrementCounter}
          disabled={loading}
          className="transition-colors hover:border-blue-400"
        >
          Increment
        </button>
        <button
          onClick={fetchCount}
          disabled={loading}
          className="transition-colors hover:border-blue-400"
        >
          Refresh Count
        </button>
      </div>

      <div className="card llm-card">
        <h3>LLM Prompt</h3>
        <textarea
          rows={4}
          onChange={handleChangePrompt}
          value={prompt}
          placeholder="Ask the LLM something..."
          className="focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={sendPrompt}
          disabled={llmLoading}
          className="transition-colors hover:border-blue-400"
        >
          {llmLoading ? "Thinking..." : "Send Prompt"}
        </button>
        {!!llmResponse && (
          <div className="llm-response">
            <h4>Response:</h4>
            <p>{llmResponse}</p>
          </div>
        )}
      </div>

      {!!loading && !error && <div className="loader" />}
      {!!error && <pre className="text-left text-red-500">{error}</pre>}
    </div>
  );
}

export default App;
