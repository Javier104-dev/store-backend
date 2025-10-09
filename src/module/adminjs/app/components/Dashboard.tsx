import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  background-color: #F5F7FA;
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #FFFFFF;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.7s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    padding: 30px;
  }
`;

const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  line-height: 50px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #4758EC;

  @media (max-width: 600px) {
    font-size: 28px;
    line-height: 40px;
  }
`;

const Text = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  line-height: 30px;
  font-weight: 300;
  margin-bottom: 40px;
  color: #666;

  @media (max-width: 600px) {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 24px;
  }
`;

const Button = styled.button`
  background-color: #4758EC;
  color: white;
  padding: 12px 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #394bd7;
  }

  @media (max-width: 600px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: 64px;
  object-fit: contain;
  margin-bottom: 24px;
`;

const redirectTo = (path: string) => {
  window.location.href = path;
};
const Dashboard: React.FC = () => {
  return (
    <Container>
      <Card>
        <StyledImage
          src="https://scalemote-assets-us-east-1.s3.amazonaws.com/Bigger/Bigger_Logo_Black.png"
          alt="Company Logo" />
        <Title>Welcome to the Admin Panel Demo</Title>
        <Text>
          Take control of your data like never before. Access, manage, and
          analyze all your database information
          in one centralized place. Whether you need to monitor user activity or
          modify some of your records,
          you’ll find everything you need here.
        </Text>
        <Button onClick={() => redirectTo("/admin/resources/Genre")}>Get
          Started</Button>
      </Card>
    </Container>
  );
};

export default Dashboard;
