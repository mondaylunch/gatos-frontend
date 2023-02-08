import { Accessor, createSignal } from "solid-js";
import axios from 'axios';
import { createStore } from "solid-js/store";
import { respondWith } from "solid-start/server/server-functions/server";

type FormFields = {
    email?: string;
    password?: string;
};

const [username, setUsername] = createSignal("hjgkgk");

const submit = (form: FormFields) => {
  const dataToSubmit = {
    email: form.email,
    password: form.password
  };

  // Add a check to see if the password is 8 characters long
  if (form.password && form.password.length < 8) {
    alert("Password must be 8 characters long");
    return;
  }

  //Login the user by making a POST request to the /api/v1/login/authenticate endpoint

  axios.post('/api/v1/login/authenticate', dataToSubmit, {
    headers: {
      'x-auth-token': 'token',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    setUsername(response.data.username);
    // alert(username());
    if (response.status.toString().charAt(0) !== '4' && response.status.toString().charAt(0) !== '5') {
      window.location.href = '/dash';
    }
  }
  ).catch(error => {
    alert(error);
  });
};
const useForm = () => {
  const [form, setForm] = createStore<FormFields>({
    email: "",
    password: ""
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

  return { form, submit, updateFormField, clearField};
};

export { useForm };
export { username, setUsername };
