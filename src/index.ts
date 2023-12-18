type Store<T> = { subscribe: (f: () => void) => () => void };

export const waitForStore = <T, S extends Store<T>>(
  store: S,
  {
    done = () => true,
    delay = 0,
  }: { done?: (store: S) => boolean; delay?: number } = {}
) =>
  new Promise<void>((res) => {
    let t: string | number | NodeJS.Timeout | undefined;
    const unsubscribe = store.subscribe(() => {
      if (done(store)) {
        if (t) clearTimeout(t);
        t = setTimeout(() => {
          unsubscribe();
          res();
        }, delay);
      }
    });
  });
