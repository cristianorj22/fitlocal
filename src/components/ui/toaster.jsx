import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useI18n } from "@/contexts/LocaleContext.jsx";

export function Toaster() {
  const { toasts } = useToast();
  const { t } = useI18n();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose aria-label={t("ui.dismissToast")} />
          </Toast>
        );
      })}
      <ToastViewport aria-label={t("ui.toastRegion")} />
    </ToastProvider>
  );
} 