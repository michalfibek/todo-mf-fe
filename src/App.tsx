import { Popup } from "./features/popup/Popup";
import "./App.css";
// import { Counter } from "./features/counter/Counter"
// import { Quotes } from "./features/quotes/Quotes"
import { Todo } from "./features/todo/Todo";

const App = () => {
  return (
    <div className="App">
      <Popup />
      <main className="relative flex flex-col items-center mt-20">
        <header>
          <h1 className="text-4xl font-bold mb-6 text-purple-600">Tasky</h1>
        </header>
        <Todo />
      </main>
    </div>
  );
};

export default App;
