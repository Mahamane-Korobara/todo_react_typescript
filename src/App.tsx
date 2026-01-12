import { useEffect, useState } from "react";
import TodoItem, { type Todo, type Priority } from "./TodoItem";
import { Construction } from "lucide-react";

function App() {
  const [input, setInput] = useState<string>(""); // C'est un hook qui permet de gérer le changement d'état d'une variable (on utilise le hook useState car la variable input va changer au fur et à mesure que l'utilisateur écrit dans le champ de saisie) le guillemet represente sa valeur par defaut qui est une chaine de caractere vide
  const [priority, setPriority] = useState<Priority>("Moyenne");

  // Maintanant utlisons une sauvegarde des taches dans le navigateur qui s'appelle localStorage dont on a une paire cle/valeur
  const savedTodos = localStorage.getItem("todos"); // on recupere les taches sauvegardees dans le localStorage avec la cle 'todos'
  const initialTodos: Todo[] = savedTodos ? JSON.parse(savedTodos) : []; // si on a des taches sauvegardees on les parse en tableau d'objets Todo sinon on initialise une liste vide
  const [todos, setTodos] = useState<Todo[]>(initialTodos); // on initialise une liste de taches vide car au debut on n'a pas de taches et que cette liste va contenir des objets de type Todo
  const [filter, setFilter] = useState<"Tous" | Priority>("Tous"); // on initialise un etat pour le filtre avec la valeur par defaut 'Tous' qui peut etre 'Tous' ou une Priorite

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos)); // on sauvegarde la liste des taches todos dans le localStorage en la convertissant en chaine de caractere avec JSON.stringify
  }, [todos]); // a chaque fois que la liste des taches todos change on execute la fonction pour sauvegarder les taches dans le localStorage

  const addTodo = () => {
    if (input.trim() === "") return; // on verifie que l'input n'est pas vide avant d'ajouter une tache

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      priority: priority,
    }; // elle ne doit pas etre isole donc il faut qu'on le creer et l'ajoute a une liste de taches

    // On ajoute la nouvelle tache newTodo et on ajoute les taches existantes todos dans une nouvelle liste newTodos
    const newTodos = [newTodo, ...todos]; // on utilise l'operateur spread (...) pour copier les taches existantes dans une nouvelle liste et on ajoute la nouvelle tache a la fin de cette liste
    setTodos(newTodos); // on met a jour la liste des taches todos avec la nouvelle liste
    setInput(""); // on vide le champ de saisie apres avoir ajoute la tache
    console.log(newTodos);

    // Ex : dans todos on 1,2,3 si on ajoute 4 avec newTodo on aura newTodos = [4,1,2,3] ce qui sera la nouvelle liste de taches todos aisni de suite
  };

  let filteredTodos: Todo[] = todos; // on initialise une variable filteredTodos avec la liste des taches todos

  if (filter === "Tous") {
    filteredTodos = todos; // si le filtre est 'Tous' on affiche toutes les taches
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter); // sinon on filtre les taches en fonction de la priorite selectionnee a  ne pas oublier que todos est une liste d'objets de type Todo en gros un tableau
  }

  const urgentCount = todos.filter(
    (todo) => todo.priority === "Urgente"
  ).length;
  const mediumCount = todos.filter(
    (todo) => todo.priority === "Moyenne"
  ).length;
  const lowCount = todos.filter((todo) => todo.priority === "Basse").length;
  const totalCount = todos.length;

  // Suppression d'une tache
  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id); // on filtre les taches pour ne garder que celles dont l'id est different de celui passe en parametre
    setTodos(newTodos); // on met a jour la liste des taches todos avec la nouvelle liste
  }

  const [selectedTodoId, setSelectedTodoId] = useState<Set<number>>(new Set()); // on creer le table qui contient des elements UNIQUES initialement vide

  function toggleTodoSelection(id: number) {
    const newSelectedTodoId = new Set(selectedTodoId);
    if (newSelectedTodoId.has(id)) {
      newSelectedTodoId.delete(id); // si l'id est deja present dans le set on le supprime
    } else {
      newSelectedTodoId.add(id); // sinon on l'ajoute
    }
    setSelectedTodoId(newSelectedTodoId); // on met a jour le set des taches selectionnees
  }

  function finishSelected() {
    const newTodos = todos.filter((todo) => 
    !selectedTodoId.has(todo.id)); // on filtre les taches pour ne garder que celles dont l'id n'est pas present dans le set des taches selectionnees
    setTodos(newTodos); // on met a jour la liste des taches todos avec la nouvelle liste
    setSelectedTodoId(new Set()); // on vide le set des taches selectionnees
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input
            type="text"
            //  le mot input est une classe de daisyUI pareil pour select
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input} // on utilise value pour lier la valeur de l'input a la variable input
            onChange={(e) => setInput(e.target.value)} // on utilise onChange pour mettre a jour la variable input a chaque fois que l'utilisateur ecrit dans le champ de saisie
          />
          <select
            className="select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
            <button
              //Nous allons faire du className dynamique en fonction du filtre selectionne
              className={`btn btn-soft ${
                filter === "Tous" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Tous")}
            >
              Tous({totalCount})
            </button>

            <button
              //Nous allons faire du className dynamique en fonction du filtre selectionne
              className={`btn btn-soft ${
                filter === "Urgente" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Urgente")}
            >
              Urgent({urgentCount})
            </button>

            <button
              //Nous allons faire du className dynamique en fonction du filtre selectionne
              className={`btn btn-soft ${
                filter === "Moyenne" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Moyenne")}
            >
              Moyenne({mediumCount})
            </button>

            <button
              //Nous allons faire du className dynamique en fonction du filtre selectionne
              className={`btn btn-soft ${
                filter === "Basse" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Basse")}
            >
              Basse({lowCount})
            </button>
          </div>

          <button onClick={finishSelected} className="btn btn-primary" disabled={selectedTodoId.size == 0}>
            FInir la sélection ({selectedTodoId.size})
          </button>
          </div>
          {filteredTodos.length > 0 ? (
            //si on execute ce bloc de code c'est qu'on a des taches a afficher
            <ul className="divide-y divide-primary/20">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    onDelete={() => deleteTodo(todo.id)}
                    // Si l'id de la tache courante est dans le set des taches selectionnees alors isSelected sera true sinon false
                    isSelected={selectedTodoId.has(todo.id)}
                    onToggleSelect={toggleTodoSelection}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">
              <Construction
                className="w-40 h-40 text-primary"
                strokeWidth={1}
              />
              <p className="text-sm">Aucune tâche à afficher</p>
            </div>
            // sinon on execute ce bloc de code
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
