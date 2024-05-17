import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TodoList from "../../components/TodoList/TodoList"
import NewTodo from "../../components/NewTodo/NewTodo"
import { useNavigate } from "react-router-dom";
import './Home.css'

export default function Home() {
  const [cookie, setCookie, removeCookie] = useCookies();
  const [todoList, setTodoList] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verifyCookie()
  }, [cookie, removeCookie]);

  const verifyCookie = async () => {
    if(!cookie.token) {
      setIsAuth(false);
      if(localStorage.getItem("todoList") === null) {
        localStorage.setItem("todoList", JSON.stringify([]));
      }
      toast("Login or signup to save your todo list to the cloud", {position: "top-center"})
      setTodoList(JSON.parse(localStorage.getItem("todoList")));
    }
    else {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/verify`, {}, {withCredentials: true})
      const { status, user } = data;
      if(status) {
        toast(`Logged in as ${user}`, {position: "top-center"})
        await axios.get(`${process.env.REACT_APP_API_URL}/todo`, {params: {email: user}})
          .then((response) => {
            setTodoList(response.data.data)
            setIsAuth(true);
          })
      }
      else {
        setIsAuth(false);
        removeCookie("token");
      }
    }
  }

  const Logout = () => {
    localStorage.setItem("todoList", JSON.stringify([]));
    removeCookie("token");
  }

  const navToLogin = () => {
    navigate("/login");
  }
  
  return(
    <>
      <div className="header">
        <h1>Todo App</h1>
        {isAuth ? <button className="auth-btn" onClick={Logout}>Logout</button> : <button className="auth-btn" onClick={navToLogin}>Login</button>}
      </div>
      <TodoList payload={{todoList, setTodoList}}/>
      <NewTodo payload={{todoList, setTodoList}}/>
      <ToastContainer />
    </>
  )
}
