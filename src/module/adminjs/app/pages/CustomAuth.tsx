import React from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { BIGGER_LOGO_URL } from '@module/adminjs/constant/logo-bigger.constant';
import SignInForm from '@module/adminjs/app/components/auth/SignInForm';
import SignUpForm from '@module/adminjs/app/components/auth/SignUpForm';
import { useGetFirstUserInfo } from '@module/adminjs/app/hooks/useGetFirstUserInfo';
import ConfirmUserForm from '../components/auth/ConfirmUserForm';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
`;

const AuthBox = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  height: min-content;
  overflow: hidden;
`;

const WelcomeSection = styled.div`
  flex: 1;
  background-color: #4763E4;
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.9;
`;

const FormSection = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
  object-fit: contain;
  margin-bottom: 2.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const CustomAuth = () => {
  const { AdminJS } = window;

  const {
    BASE_APP_URL,
  } = AdminJS.env;

  const { count, isVerified, isLoading } = useGetFirstUserInfo(BASE_APP_URL);

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  const renderAuthForm = () => {
    if (count === 0) {
      return <SignUpForm />;
    }
    if (count === 1 && !isVerified) {
      return <ConfirmUserForm />;
    }
    return <SignInForm />;
  };

  return (
    <Container>
      <ToastContainer />
      <AuthBox>
        <WelcomeSection>
          <WelcomeTitle>Welcome</WelcomeTitle>
          <WelcomeText>
            to AdminJS – the world's leading open-source auto-generated admin panel for your Node.js application that allows you to manage all your data in one place
          </WelcomeText>
        </WelcomeSection>
        <FormSection>
          <Logo src={BIGGER_LOGO_URL} alt="Bigger" />
          {renderAuthForm()}
        </FormSection>
      </AuthBox>
    </Container>
  );
};

export default CustomAuth;