import { ChangeEvent, useState } from 'react';

interface UseFormReturn<T> {
  values: T;
  isLoading: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useForm = <T extends Record<string, string>>(
  initialValues: T,
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    values,
    isLoading,
    handleChange,
    setIsLoading,
  };
};
