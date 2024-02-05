import { useCallback, useState } from "react";

// ----------------------------------------------------------------------

export function useDialog(defaultOpen = false, defaultValue = null) {
  const [open, setOpen] = useState(defaultOpen);
  const [value, setValue] = useState(defaultValue);

  const onOpen = useCallback((newValue) => {
    setOpen(true);
    setValue(newValue);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setValue(null);
  }, []);

  return {
    open,
    value,
    onOpen,
    onClose,
  };
}
