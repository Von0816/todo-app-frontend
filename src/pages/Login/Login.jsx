import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import "./Login.css"

export default function Login() {
  const [inputValue, setInputValue] = useState(({email: "", password: ""}));
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if(cookies.token) {
      navigate("/");
    }
  }, [])

  const inputOnChange = (e) => {
    const {name, value} = e.target;
    
    setInputValue({...inputValue, [name]: value});
  }

  const handleError = (error) => {
    toast.error(error, {
      position: "top-center"
    })
  }

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "top-center"
    })
  }

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          ...inputValue,
        },
        {withCredentials: true}
      );
      const { success, message } = data;
      if(success) {
        setCookie("token", message.token, {
          httpOnly: false,
          sameSite: "none",
          secure: true
        })
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000)
      }
      else {
        handleError(message);
        setInputValue({
          ...inputValue,
          email: "",
          password: ""
        })
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  const logoOnClick = () => {
    navigate("/");
  }

  return(
    <>
      <h1 className="logo" onClick={logoOnClick}>Todo App</h1>
      <div className="flex-column full-height">
        <form className="flex-column" id="form__login" onSubmit={onLogin}>
          <div className="form__item flex-column">
            <label className="input__label" htmlFor="email">Email</label>
            <input className="form__input" name="email" id="input__email" type="email" value={inputValue.email} placeholder="Email" onChange={inputOnChange} required />
          </div>
          <div className="form__item flex-column">
            <label className="input__label" htmlFor="password">Password</label>
            <input className="form__input" name="password" id="input__password" type="password" value={inputValue.password} placeholder="Password" onChange={inputOnChange} required />
          </div>
          <a href="/signup" id="anchor__signup">click here to signup</a>
          <button className="form__button" id="button__login" type="submit">Login</button>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}
