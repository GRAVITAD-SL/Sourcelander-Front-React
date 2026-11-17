import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hook personalizado para manejar la hidratación del lado del cliente.
 * Evita errores de hidratación cuando el estado del servidor difiere del
 * cliente. Patrón recomendado por React (useSyncExternalStore con snapshot
 * distinto en servidor), en lugar de setState dentro de un useEffect.
 */
export function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // snapshot cliente: ya montado
    () => false // snapshot servidor: sin hidratar
  );
}
