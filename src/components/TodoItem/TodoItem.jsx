import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import { toast } from "react-toastify";
import './TodoItem.css'

export default function TodoItem(props) {
  const [cookie, setCookie, removeCookie] = useCookies();
  const [title, setTitle] = useState(props.todoTitle);
  const [isCompleted, setIsCompleted] = useState(props.todoIsCompleted);
  const [isEdit, setIsEdit] = useState(false);

  const markComplete = async (id) => {
    try {
      setIsCompleted(!isCompleted)
      if(!cookie.token) {
        const lTodoList = JSON.parse(localStorage.getItem("todoList"));
        const index = lTodoList.findIndex(x => x._id === id);
        const cTodo = lTodoList[index];
        lTodoList[index] = {...cTodo, isCompleted: !props.todoIsCompleted};
        localStorage.setItem("todoList", JSON.stringify(lTodoList));
        props.setTodoList(lTodoList);
      }
      else {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/verify`, {}, {withCredentials: true})
        const { status } = data;
        if(status) {
          await axios.put(`${process.env.api_url}/todo/${id}/complete`)
        }
        else {
          removeCookie("token");
        }
      }
    } catch (error) {
      toast.error("Something went wrong.", {position: "bottom-right",})      
    }
  }

  const titleOnChange = (e) => {
    const target = e.target; 
    setTitle(target.value);
  }

  const saveOnClick = async (id) => {
    try {
      if(!cookie.token) {
        const lTodoList = JSON.parse(localStorage.getItem("todoList"));
        const index = lTodoList.findIndex(x => x._id === id);
        const cTodo = lTodoList[index];
        lTodoList[index] = {...cTodo, title: title};
        localStorage.setItem("todoList", JSON.stringify(lTodoList));
        props.setTodoList(lTodoList);
      }
      else {
        const { data } = await axios.post(`${process.env.api_url}/verify`, {}, {withCredentials: true})
        const { status } = data;
        if(status) {
          await axios.put(`${process.env.api_url}/todo/${id}`, {title: title})
        }
        else {
          removeCookie("token");
        }
      }
      setIsEdit(false);
      toast.success("Todo title updated.", {position: "bottom-right"}) 
    } catch (error) {
      toast.error("Something went wrong", {position: "bottom-right"}) 
    }

  }

  const editOnClick = () => {
    setIsEdit(!isEdit);
  }

  const cancelOnClick = () => {
    setIsEdit(!isEdit);
    setTitle(props.todoTitle);
  }

  const deleteOnClick = async (id) => {
    try {
      if(!cookie.token) {
        const lTodoList = JSON.parse(localStorage.getItem("todoList"));
        const index = lTodoList.findIndex(x => x._id === id);
        lTodoList.splice(index, 1);
        localStorage.setItem("todoList", JSON.stringify(lTodoList));
        props.setTodoList(lTodoList);
      }
      else {
        const { data } = await axios.post(`${process.env.api_url}/verify`, {}, {withCredentials: true})
        const { status, user } = data;
        if(status) {
          await axios.put(`${process.env.api_url}/todo/${id}/delete`)

          await axios.get("/todo", {email: user})
            .then((response) => {
              props.setTodoList(response.data.data);
            })
        }
        else {
          removeCookie("token");
        }
      }
      setIsEdit(false);
      toast.success("Todo deleted.", {position: "bottom-right"}) 
    } catch (error) {
      toast.error("Something went wrong", {position: "bottom-right"}) 
    }
  }

  return(
    <li className={"todo-item "+ (isCompleted ? "complete" : "")}>
      <div className="checkbox__container">
        <input type="checkbox" className="checkbox__isComplete" onChange={() => markComplete(props.todoId)} checked={isCompleted} />
      </div>
      <input type="text" name="todo-title" className="input__title" onChange={titleOnChange} value={title} disabled={!isEdit}/>
      {isEdit 
        ? 
        <div className="todo-item__button-group">
          <button className="todo-item__button" onClick={() => saveOnClick(props.todoId)}>Save</button>
          <button className="todo-item__button" onClick={cancelOnClick}>Cancel</button>
        </div>
        :
        <div className="todo-item__button-group">
          <button className="todo-item__button" onClick={editOnClick}>Edit</button>
          <button className="todo-item__button" onClick={() => deleteOnClick(props.todoId)}>Delete</button>
        </div>
      }
    </li>
  )
}
