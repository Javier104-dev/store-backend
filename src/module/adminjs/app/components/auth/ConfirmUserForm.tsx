import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { axiosService } from '@module/adminjs/app/config/axios';
import { useForm } from '@module/adminjs/app/hooks/useForm';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;
  transition: border-color 0.15s ease-in-out;

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

const ConfirmUserForm = () => {
  const { values, isLoading, handleChange, setIsLoading } = useForm({
    username: '',
    code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosService.post('/auth/confirm-user', {
        username: values.username,
        code: values.code
      });
      toast.success('User confirmed successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to confirm user. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="username">Email</Label>
        <Input
          id="username"
          name="username"
          type="email"
          value={values.username}
          onChange={handleChange}
          required
          placeholder="example@gmail.com"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="code">Confirmation Code</Label>
        <Input
          id="code"
          name="code"
          type="text"
          value={values.code}
          onChange={handleChange}
          required
          placeholder="123456"
        />
      </FormGroup>
      <Button type="submit" disabled={isLoading || values.username.length === 0 || values.code.length === 0}>
        {isLoading ? 'Confirming...' : 'Confirm Account'}
      </Button>
    </Form>
  );
};

export default ConfirmUserForm;