import './App.css';
import Form from './components/Form.js';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('user is required'),
  email: yup.string().required('email is required'),
  password: yup.string().required('password is required') 
               .min(2, 'password must be at least 2 chars'),
  terms: yup.boolean().oneOf([true],'must accept terms'),
  language: yup.string().required('language is required'),
})

function App() {

  const [form, setForm] = useState({
    name:'',
    email:'',
    password:'',
    terms:false,
    language:'',
  })

  const [errors, setErrors] = useState({
    name:'',
    email:'',
    password:'',
    terms:false,
    language:'',
  })

  const [disabled, setDisabled] = useState(true)

  const setFormErrors = (name, value) => {
    yup.reach(schema, name).validate(value)
       .then(()=> setErrors({...errors, [name]:''}))
       .catch(err => setErrors({...errors, [name]:err.errors[0]}))
  }

  const change = event =>{
    const {checked, value, name, type} = event.target
    const valueToUse = type === 'checkbox' ? checked : value
    setForm({...form, [name]:valueToUse})
    setFormErrors(name, valueToUse)
  }

  const submit = event => {
    event.preventDefault()
    console.log('submitted')
    const newUser = {user: form.user.trim(), email: form.email,
                    terms: form.terms, language: form.language}
    axios.post('https://regres.in/api/axios', newUser)
         .then(res=>{
           setForm({user:'', email:'', terms: false, language:''})
           console.log('success!', res)
         })
         .catch(err=>{
          debugger
          console.log(err.response)
         })
  }

  useEffect( () => {
     schema.isValid(form).then(valid => setDisabled(!valid))
  }, [form])  


  return (
    <div className="App">

      <div style={{color:'red'}}>
        <div>{errors.name}</div><div>{errors.email}</div><div>{errors.password}</div>
        <div>{errors.terms}</div><div>{errors.language}</div>
      </div>
      <form onSubmit={submit}>
        <label>Name
          <input onChange={change} value={form.name} name='name' type='text'/>
        </label>

        <label>Email
          <input onChange={change} value={form.email} name='email' type="email"/>
        </label>

        <label>Password
          <input onChange={change} value={form.password} name='password' type="password"/>
        </label>

        <label>Terms of Service
          <input onChange={change} checked={form.terms} name='terms' type="checkbox"/>
        </label>

        <button disabled={disabled}>submit</button>
      </form>

    </div>
  );
}

export default App;
