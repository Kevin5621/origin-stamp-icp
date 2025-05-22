import { useState } from "react";
import ReactIcon from "../assets/React-icon.webp";
import "./styles/App.css";

// Import components and views
import { Loader, ErrorDisplay } from "./components";
import { GreetingView, CounterView, LlmPromptView } from "./views";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={ReactIcon} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vibe Coding Template</h1>
      <h2>React + Rust + Internet Computer</h2>

      {/* Greeting Section */}
      <GreetingView onError={handleError} setLoading={setLoading} />

      {/* Counter Section */}
      <CounterView onError={handleError} setLoading={setLoading} />

      {/* LLM Prompt Section */}
      <LlmPromptView onError={handleError} setLoading={setLoading} />

      {loading && !error && <Loader />}
      {!!error && <ErrorDisplay message={error} />}
    </div>
  );
}

export default App;
