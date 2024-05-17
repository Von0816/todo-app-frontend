import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import "./Signup.css"

export default function Signup() {
  const [inputValue, setInputValue] = useState(({email: "", password: ""}));
  const [cookies] = useCookies();
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

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        {
          ...inputValue,
        },
        {withCredentials: true}
      );
      const { success, message } = data;
      if(success) {
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
        <form className="flex-column" id="form__signup" onSubmit={onSignup}>
          <div className="form__item flex-column">
            <label className="input__label" htmlFor="email">Email</label>
            <input className="form__input" name="email" id="input__email" type="email" value={inputValue.email} placeholder="Email" onChange={inputOnChange} required />
          </div>
          <div className="form__item flex-column">
            <label className="input__label" htmlFor="password">Password</label>
            <input className="form__input" name="password" id="input__password" type="password" value={inputValue.password} placeholder="Password" onChange={inputOnChange} required />
          </div>
          <a href="/login" id="anchor__signup">click here to login</a>
          <button className="form__button" id="button__signup" type="submit">Signup</button>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}
