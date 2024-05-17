import TodoItem from "../TodoItem/TodoItem";
import "./TodoList.css"

export default function TodoList(props) {
  const {todoList, setTodoList} = props.payload;

  return(
    <>
      <ul id="todolist">
        {todoList.map((todo) => {
          return(<TodoItem key={todo._id} todoId={todo._id} todoTitle={todo.title} todoIsCompleted={todo.isCompleted} setTodoList={setTodoList}/>)
        })}
      </ul>
    </>
  )
}
