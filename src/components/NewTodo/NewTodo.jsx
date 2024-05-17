import axios from "axios";
import { useState } from "react"
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import './NewTodo.css'

export default function NewTodo(props) {
  const [newTodo, setNewTodo] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();
  const {todoList, setTodoList} = props.payload;

  const newTodoOnChange = (e) => {
    const target = e.target;
    setNewTodo(target.value);
  }

  const submitNewTodo = async (e) => {
    e.preventDefault();
    try {
      if(cookies.token) {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/verify`, {}, {withCredentials: true})
        const { status, user } = data;
        if(status) {
          await axios.post(`${process.env.REACT_APP_API_URL}/todo`, {title: newTodo, email: user})
            .then((response) => {
              setTodoList([...props.payload.todoList, response.data])
            })
        }
        else {
          removeCookie("token");
        }
      }
      else {
        const todo = {
                        _id: JSON.parse(localStorage.getItem("todoList")).length + 1,
                        title: newTodo,
                        isCompleted: false,
                        createdAt: new Date(Date.now()),
                        updatedAt: new Date(Date.now()) 
                      }
        localStorage.setItem("todoList", JSON.stringify([...JSON.parse(localStorage.getItem("todoList")), todo]))
        setTodoList([...todoList, todo])
      }
      setNewTodo("");
      toast.success("New todo added.", {position: "bottom-right"});
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.", {position: "bottom-right"});
    }
  }

  return(
    <form id="form__new-todo" onSubmit={submitNewTodo}>
      <input type="text" className="form__input" id="input__new-todo" value={newTodo} onChange={newTodoOnChange} placeholder="Add new todo" />
    </form>
  )
}
