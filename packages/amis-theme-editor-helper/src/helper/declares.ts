export interface Colors {
  main?: string;
  none?: string;
  colors: {
    label: string;
    token: string;
    color: string;
    index: number;
  }[];
  common: {
    label: string;
    id: string;
    color: number;
  }[];
}

export interface Font {
  label: string;
  token: string;
  value?: string | number;
  className?: string;
  previewUrl?: string;
  body?: {value: string | number}[];
}

export interface Border {
  label: string;
  token: string;
  disabled?: boolean;
  value: string;
}

export interface Size {
  label: string;
  disabled?: boolean;
  token: string;
  value: string;
}

export interface ShadowData {
  inset: boolean;
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
}

export interface Shadow {
  label: string;
  token: string;
  disabled?: boolean;
  value: ShadowData[];
}

export interface ThemeDefinition {
  version?: string;
  config: {
    name: string;
    key: string;
    description: string;
    isDark?: boolean;
  };
  global: {
    colors: {
      brand: {
        token: string;
        label: string;
        body: Colors;
      };
      neutral: {
        token: string;
        label: string;
        body: {
          token: string;
          label: string;
          body: Colors;
        }[];
      };
      func: {
        token: string;
        label: string;
        body: {
          token: string;
          label: string;
          body: Colors;
        }[];
      };
      data?: {
        label: string;
        body: {
          label: string;
          token: string;
          colors: {value: string}[];
          custom?: boolean;
        }[];
      };
    };
    fonts: {
      base: {
        label: string;
        token: string;
        body: {
          value: string;
          label?: string;
          className?: string;
          previewUrl?: string;
        }[];
      };
      size: {
        label: string;
        token: string;
        body: Font[];
      };
      lineHeight: {
        label: string;
        token: string;
        body: Font[];
      };
      weight: {
        label: string;
        token: string;
        body: Font[];
      };
    };
    borders: {
      width: {
        label: string;
        token: string;
        body: Border[];
      };
      style: {
        label: string;
        token: string;
        body: Border[];
      };
      radius: {
        label: string;
        token: string;
        body: Border[];
      };
    };
    sizes: {
      size: {
        label: string;
        token: string;
        base: number;
        body: Size[];
        start: string;
      };
    };
    shadows: {
      shadow: {
        label: string;
        token: string;
        body: Shadow[];
      };
    };
  };
  component: {
    [x: string]: any;
  };
  customStyle?: {
    [css: string]: string;
  };
  icons?: any;
}

export interface PlainObject {
  [propsName: string]: any;
}
