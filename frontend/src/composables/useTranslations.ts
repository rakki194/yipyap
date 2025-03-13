import { useAppContext } from "~/contexts/app";

export const useTranslations = () => {
  const app = useAppContext();
  return app.t;
}; 
