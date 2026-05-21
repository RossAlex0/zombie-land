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
      className: 'firstName',
      placeholder: 'Prénom',
      label: 'Prénom',
    },
    {
      type: 'text',
      id: 'signupLastName',
      name: 'lastName',
      text: 'Nom',
      className: 'lastName',
      placeholder: 'Nom',
      label: 'Nom',
    },
    {
      type: 'email',
      id: 'signupEmail',
      name: 'email',
      text: 'email',
      className: 'email',
      placeholder: 'Email',
      label: 'Email',
    },
    {
      type: 'password',
      id: 'signupPassword',
      name: 'password',
      text: 'Mot de passe',
      className: 'password',
      placeholder: 'Mot de passe',
      label: 'Mot de passe',
    },
    {
      type: 'password',
      id: 'signupConfirmPassword',
      name: 'confirmPassword',
      text: 'Confirmez le mot de passe',
      className: 'confirmPassword',
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
      <div className="formFields">
        {fields.map((field) => (
          <FormInput
            key={field.id}
            type={field.type}
            id={field.id}
            name={field.name}
            className={field.className}
            placeholder={field.placeholder}
          >
            <TextZbl color="white">{field.text}</TextZbl>
          </FormInput>
        ))}
      </div>

      <div className="submit">
        <ButtonZbl type="submit" theme="dark">
          S`&apos;`inscrire
        </ButtonZbl>
      </div>
    </form>
  );
}
