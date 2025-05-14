import { toast as sonnerToast, ToastT } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
} & Omit<Parameters<typeof sonnerToast>[1], 'description' | 'action'>;

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
