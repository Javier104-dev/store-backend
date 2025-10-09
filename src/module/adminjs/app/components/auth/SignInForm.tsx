import { useForm } from '@module/adminjs/app/hooks/useForm';
import { notificationService } from '@module/adminjs/app/services/notification.service';
import React from 'react';
import styled from 'styled-components';

const LoginForm = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const Label = styled.label`
  display: block;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;

  &::after {
    content: '*';
    color: #dc2626;
    margin-left: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4763E4;
    box-shadow: 0 0 0 1px #4763E4;
  }
`;

const Button = styled.button`
  display: block;
  margin: 0 auto;
  width: 50%;
  padding: 0.75rem;
  background-color: #4763E4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3651d3;
  }

  &:disabled {
    background-color: #93a3f8;
    cursor: not-allowed;
  }
`;

interface LoginFormValues {
  email: string;
  password: string;
  [key: string]: string;
}

export default function SignInForm() {
  const { values, handleChange, isLoading, setIsLoading } = useForm<LoginFormValues>({
    email: '',
    password: '',
  });


 const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        notificationService.error('Authentication failed');
        throw new Error('Authentication failed');
      }

      notificationService.success('Login successful');

      window.location.href = '/admin';
    } catch (error) {
      notificationService.error(`Authentication failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="example@gmail.com"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="123456"
            required
          />
        </InputGroup>
        <Button type="submit" disabled={isLoading || values.email.length === 0 || values.password.length === 0}>
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
    </LoginForm>
  );
}
