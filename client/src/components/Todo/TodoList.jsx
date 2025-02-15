import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editMode, setEditMode] = useState(null); // Tracks the ID of the todo being edited
  const [editText, setEditText] = useState(''); // Tracks the text for the todo being edited
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/todos', { headers });
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/todos',
        { text: newTodo },
        { headers }
      );
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const editTodo = async (id) => {
    if (!editText.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { text: editText },
        { headers }
      );
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, text: editText } : todo))
      );
      setEditMode(null);
      setEditText('');
    } catch (err) {
      setError('Failed to edit todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { completed: !completed },
        { headers }
      );
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, completed: !completed } : todo))
      );
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, { headers });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (loading) return <Spinner />;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>My Tasks</h2>
        <div className="todo-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button className="todo-button add-task-button">
  <svg width="16" height="16" viewBox="0 0 16 16">
    <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="2"/>
  </svg>
  Add Task
</button>
      </form>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
          </div>
        ) : (
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editMode === todo._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      editTodo(todo._id);
                    }}
                    className="edit-form"
                  >
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                      style={{ 
                        flex: 1,
                        marginRight: '8px',
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button type="submit" className="todo-button edit-button">Save</button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(null);
                          setEditText('');
                        }}
                        className="todo-button edit-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo._id, todo.completed)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span className="todo-text">{todo.text}</span>
                    <button
                      onClick={() => {
                        setEditMode(todo._id);
                        setEditText(todo.text);
                      }}
                      className="todo-button edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="todo-button delete-button"
                      aria-label="Delete todo"
                    >
                      ×
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TodoList;
