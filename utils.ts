type KeysOf<S> = S extends Record<infer K, any> ? K : never;
