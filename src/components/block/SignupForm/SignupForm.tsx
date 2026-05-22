import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import './SignupForm.scss';

import FormInput from '@components/ui/FormInput/FormInput';
import TextZbl from '@components/ui/textZbl/TextZbl';

import useSignup from '@hooks/auth/useSignup';

export default function SignupForm() {
  const { signup } = useSignup();
  const fields = [
    {
      type: 'text',
      id: 'signupFirstName',
      name: 'firstName',
      text: 'Prénom',
      className: 'formInput__field signupForm__input',
      placeholder: 'Prénom',
      label: 'Prénom',
    },
    {
      type: 'text',
      id: 'signupLastName',
      name: 'lastName',
      text: 'Nom',
      className: 'formInput__field signupForm__input',
      placeholder: 'Nom',
      label: 'Nom',
    },
    {
      type: 'email',
      id: 'signupEmail',
      name: 'email',
      text: 'email',
      className: 'formInput__field signupForm__input',
      placeholder: 'Email',
      label: 'Email',
    },
    {
      type: 'password',
      id: 'signupPassword',
      name: 'password',
      text: 'Mot de passe',
      className: 'formInput__field signupForm__input',
      placeholder: 'Mot de passe',
      label: 'Mot de passe',
    },
    {
      type: 'password',
      id: 'signupConfirmPassword',
      name: 'confirmPassword',
      text: 'Confirmez le mot de passe',
      className: 'formInput__field signupForm__input',
      placeholder: 'Confirmation du mot de passe',
      label: 'Confirmation',
    },
  ];
  const handleSubmit = async (formData: FormData) => {
    const data = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };
    if (data.password !== data.confirmPassword) return;
    await signup(data);
  };

  return (
    <form className="signupForm" action={handleSubmit}>
      <TextZbl tag="h2">Se déclarer parmi les survivants</TextZbl>
      <div className="formFields">
        {fields.map((field) => (
          <FormInput
            key={field.id}
            type={field.type}
            id={field.id}
            name={field.name}
            className={'formInput__field signupForm__input'}
            placeholder={field.placeholder}
          >
            <TextZbl color="white" tag="h3">
              {field.text}
            </TextZbl>
          </FormInput>
        ))}
      </div>

      <div className="signupForm__submit">
        <ButtonZbl className="signupForm__button" type="submit" theme="light">
          S&apos;inscrire
        </ButtonZbl>
      </div>
    </form>
  );
}
