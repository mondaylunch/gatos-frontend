import { Accessor } from "solid-js";
import axios from 'axios';
import { createStore } from "solid-js/store";
import { respondWith } from "solid-start/server/server-functions/server";

type FormFields = {
    username?: string;
    email?: string;
    password?: string;
};

const submit = (form: FormFields) => {
  const dataToSubmit = {
    username: form.username,
    email: form.email,
    password: form.password
  };

  fetch('/api/v1/sign_up', {
    method: 'POST',
    headers: {
      'x-auth-token': 'token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSubmit)
  })
    .then(response => response.json())
    .then(data => {
      alert(data);
      console.log(data);
    })
    .catch(error => {
      alert(error);
    });
};
const useForm = () => {
  const [form, setForm] = createStore<FormFields>({
    username: "",
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

  return { form, submit, updateFormField, clearField };
};

export { useForm };