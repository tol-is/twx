declare global {
  type TW_BREAKPOINT = "mobile" | "tablet" | "desktop";
}

type BREAKPOINT_KEYS = TW_BREAKPOINT | "_";

type Maybe<S> = S | undefined | null;

type ConfigClassName = Maybe<string | string[]>;

type CSSClassName = Maybe<string>;

type SchemaVariants = Record<string, Record<string, ConfigClassName>>;

type Variant<T> = T extends number
  ? `${T}` | T
  : T extends "true"
  ? boolean | T
  : T extends "false"
  ? boolean | T
  : T extends `${number}`
  ? number | T
  : T;

type ResponsiveVariant<V> = {
  [Breakpoint in BREAKPOINT_KEYS]?: Variant<V>;
};

type ParamsOf<S> = S extends SchemaVariants
  ? {
      [V in keyof S]?: Variant<keyof S[V]> | ResponsiveVariant<keyof S[V]>;
    }
  : never;

type DefaultsOf<S> = S extends SchemaVariants
  ? {
      [V in keyof S]?: Variant<keyof S[V]>;
    }
  : never;

type Config<S> = S extends SchemaVariants
  ? {
      base?: ConfigClassName;
      variants: S;
      defaults?: DefaultsOf<S>;
    }
  : never;

type ReturnType<S extends SchemaVariants> = (
  params: ParamsOf<S>
) => CSSClassName;

/////////////////////////////////////////////

// singleton breakpoint keys
const breakpoints: TW_BREAKPOINT[] = [];

const setup = (keys: TW_BREAKPOINT[]) => {
  keys.map((bp) => breakpoints.push(bp));
};

const style = <S extends SchemaVariants>(config?: Config<S>): ReturnType<S> => {
  console.log(config);
  return (props) => {
    console.log(props);
    return "classname";
  };
};

/////////////////////////////////////////////

// configure tailwind breakpoint keys
// at the root
setup(["mobile", "tablet", "desktop"]);

const tx = style({
  variants: {
    rounded: {
      true: "rounded-full",
      false: "rounded-sm",
    },
  },
});

const twx = style({
  base: "font-bold",
  variants: {
    size: {
      small: "text-sm",
      medium: ["text-md", "tracking-wide"],
    },
    level: {
      1: "text-uppercase",
      2: "text-normal",
    },
    invert: {
      true: "bg-black",
      false: "bg-white",
    },
  },
  defaults: {
    size: "small",
    invert: false,
  },
});

// get style
twx({ size: "medium", invert: false, level: 2 });

// implicit coersion
twx({ size: "medium", invert: "false", level: "2" });

// responsive style
twx({ size: { _: "small", mobile: "medium", desktop: undefined } });

twx({
  _: { size: "small" },
  mobile: { size: "medium" },
});

// invalid variant
twx({ potato: 1 });

// invalid variant value
twx({ size: "big" });

// invalid breakpoint
twx({ size: { potato: "medium" } });

// invalid breakpoint value
twx({ size: { tablet: "big" } });

// defaults invalid value
const r2 = style({
  variants: {
    size: {
      small: "text-sm",
      medium: "text-md",
    },
  },
  defaults: {
    size: "big",
  },
});

// defaults invalid variant
const r3 = style({
  variants: {
    size: {
      small: "text-sm",
      medium: "text-md",
    },
  },
  defaults: {
    potato: "small",
  },
});

export {};
