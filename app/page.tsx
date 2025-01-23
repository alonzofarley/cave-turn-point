"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

type Todo = Schema["Todo"]["type"]
  
export default function App() {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const { signOut } = useAuthenticator();

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
      isDone: false
    });
  }

  function deleteTodo(id: Todo["id"]){
    client.models.Todo.delete({id: id});
  }

  function toggleTodoDone(todo: Todo){
    client.models.Todo.update({...todo, isDone: !todo.isDone});
  }

  console.log(todos);

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div>
              <label>{todo.content}</label>
            </div>
            <div>
              <label>{String(todo.isDone)}</label>
            </div>
            <div>
              <button onClick={() => {toggleTodoDone(todo)}}>Mark As Done</button>
            </div>
            <div>
              <button onClick={() => {deleteTodo(todo.id)}}>Delete</button>
            </div></li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <footer>
        <button onClick={signOut}>Sign out</button>
      </footer>
    </main>
  );
}
