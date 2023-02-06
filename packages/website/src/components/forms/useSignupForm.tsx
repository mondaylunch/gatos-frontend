import { Accessor } from "solid-js";
import axios from 'axios';
import { createStore } from "solid-js/store";
import { respondWith } from "solid-start/server/server-functions/server";
import { setUsername } from "./useLoginForm";

type FormFields = {
    username?: string;
    email?: string;
    password?: string;
    password_confirm?: string;
};

const submit = (form: FormFields) => {
  const dataToSubmit = {
    username: form.username,
    email: form.email,
    password: form.password,
    password_confirm: form.password_confirm
  };

  // Add a check to see if the password is 8 characters long
  if (form.password && form.password.length < 8) {
    alert("Password must be 8 characters long");
    return;
  }

  // Add a check to see if the password and password_confirm fields match
  if (form.password !== form.password_confirm) {
    alert("Passwords do not match");
    return;
  }

  //Add a check to see if the username is already taken by making a GET request to the /api/v1/sign_up/check_username/:username endpoint
  //The endpoint will return json {"in_use": true} if the username is already taken
  axios.get(`/api/v1/sign_up/check_username/${form.username}`).then((res) => {
    if (res.data.in_use) {
      alert("Username already taken");
      return;
    }
    axios.post('/api/v1/sign_up', dataToSubmit, {
      headers: {
        'x-auth-token': 'token',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status.toString().charAt(0) !== '4' && response.status.toString().charAt(0) !== '5') {
        setUsername(response.data.username);
        window.location.href = '/dash';
      }
    })
    .catch(error => {
      alert(error);
    });
  });
  
};
const useForm = () => {
  const [form, setForm] = createStore<FormFields>({
    username: "",
    email: "",
    password: "",
    password_confirm: ""
  });

  const clearField = (fieldName: string) => {
    setForm({
      [fieldName]: ""
    });
  };

  const updateFormField = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    if (inputElement.type === "checkbox") {
      setForm({
        [fieldName]: !!inputElement.checked
      });
    } else {
      setForm({
        [fieldName]: inputElement.value
      });
    }
  };

  return { form, submit, updateFormField, clearField,};
};

export { useForm };