import { ChangeEvent, useState, useEffect } from "react";
import "./styles/App.scss";
import ReactIcon from "../assets/React-icon.webp";
import { vibe_coding_template_backend } from "../../declarations/vibe_coding_template_backend";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [name, setName] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [count, setCount] = useState<bigint>(BigInt(0));

  const fetchGreeting = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const res = await vibe_coding_template_backend.greet(name || "World");
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
      const res = await vibe_coding_template_backend.get_count();
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
      const res = await vibe_coding_template_backend.increment();
      setCount(res);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (
    event: ChangeEvent<HTMLInputElement> | undefined
  ): void => {
    if (!event?.target.value) {
      return;
    }
    setName(event.target.value);
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
        />
        <button onClick={fetchGreeting} disabled={loading}>
          Get Greeting
        </button>
        {!!response && <div className="response">{response}</div>}
      </div>

      <div className="card">
        <h3>Counter: {count.toString()}</h3>
        <button onClick={incrementCounter} disabled={loading}>
          Increment
        </button>
        <button onClick={fetchCount} disabled={loading}>
          Refresh Count
        </button>
      </div>

      {!!loading && !error && <div className="loader" />}
      {!!error && (
        <pre style={{ textAlign: "left", color: "red" }}>{error}</pre>
      )}
    </div>
  );
}

export default App;
