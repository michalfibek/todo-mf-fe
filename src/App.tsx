import "./App.css"
// import { Counter } from "./features/counter/Counter"
// import { Quotes } from "./features/quotes/Quotes"
import { Todos } from "./features/todos/Todos"

const App = () => {
  return (
    <div className="App">
      <main className="relative min-h-screen bg-white flex flex-col items-center mt-8">
        <header>
          <h1 className="text-4xl font-bold mb-6 text-lime-600">Taskey</h1>
        </header>
        <Todos />
      </main>
    </div>
  )
}

export default App
