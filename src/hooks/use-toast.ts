import { toast as sonnerToast, type Toast as SonnerToast } from "sonner";

type ToastProps = SonnerToast & {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const useToast = () => {
  const toast = (props: ToastProps | string) => {
    if (typeof props === "string") {
      return sonnerToast(props);
    }
    
    const { title, description, action, ...rest } = props;
    
    return sonnerToast(title as string, {
      description,
      action,
      ...rest,
    });
  };

  return {
    toast,
    // Keep compatibility with the existing toasts interface
    toasts: [] as any[],
  };
};

export { useToast, sonnerToast as toast };
