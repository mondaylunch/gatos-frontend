import { Accessor } from "solid-js";
import { createStore } from "solid-js/store";

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
  // TODO: Send data to server
  alert(JSON.stringify(dataToSubmit, null, 2));
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