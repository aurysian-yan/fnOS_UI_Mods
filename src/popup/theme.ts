import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

export const popupSystem = createSystem(
  defaultConfig,
  defineConfig({
    globalCss: {
      html: {
        bg: "bg",
        color: "fg"
      },
      body: {
        bg: "transparent"
      },
      "*": {
        "--ring-color": "var(--accent-border-strong)",
        _dark: {
          "--ring-color": "var(--accent-border-strong)"
        }
      },
      "[data-scope='card'][data-part='root']": {
        borderRadius: "28px",
        borderColor: "border.subtle",
        bg: "bg.panel",
        backdropFilter: "blur(24px) saturate(1.2)",
        boxShadow: {
          base: "0 18px 46px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.72)",
          _dark:
            "0 22px 52px rgba(0, 0, 0, 0.48), 0 4px 16px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
        }
      },
      "[data-scope='button'][data-part='root']": {
        borderRadius: "9999px",
        fontWeight: "600"
      },
      "[data-scope='input'][data-part='input'], [data-scope='textarea'][data-part='textarea'], [data-scope='native-select'][data-part='field']":
        {
          borderRadius: "18px",
          bg: "bg.field",
          borderColor: "border",
          color: "fg",
          boxShadow: {
            base: "inset 0 1px 0 rgba(255, 255, 255, 0.48)",
            _dark: "inset 0 1px 0 rgba(255, 255, 255, 0.05)"
          }
        },
      "[data-scope='radio-card'][data-part='item-control']": {
        borderRadius: "22px",
        bg: {
          base: "rgba(255, 255, 255, 0.46)",
          _dark: "rgba(28, 28, 28, 0.62)"
        },
        borderColor: {
          base: "rgba(23, 23, 23, 0.08)",
          _dark: "rgba(245, 245, 245, 0.12)"
        }
      },
      "[data-scope='radio-card'][data-part='item-control'][data-state='checked']": {
        bg: "var(--accent-soft)",
        borderColor: "var(--accent-border-strong)",
        boxShadow: "0 0 0 1px var(--accent-border)"
      },
      "[data-scope='radio-card'][data-part='item-indicator']": {
        color: "var(--brand)"
      },
      "[data-scope='checkbox'][data-part='control'][data-state='checked']": {
        bg: "var(--brand)",
        borderColor: "var(--brand)",
        color: "var(--brand-contrast)"
      },
      "[data-scope='checkbox'][data-part='control'][data-state='indeterminate']": {
        bg: "var(--brand)",
        borderColor: "var(--brand)",
        color: "var(--brand-contrast)"
      },
      "[data-scope='checkbox'][data-part='label'][data-state='checked']": {
        color: "fg"
      },
      "[data-scope='link'][data-part='root']": {
        color: "var(--brand)"
      },
      "[data-scope='button'][data-part='root'][data-variant='outline']": {
        borderColor: "border",
        bg: "transparent",
        _hover: {
          borderColor: "var(--accent-border-strong)",
          bg: "var(--accent-soft)"
        }
      },
      "[data-scope='checkbox'][data-part='control']": {
        borderRadius: "9999px"
      }
    },
    theme: {
      tokens: {
        radii: {
          sm: { value: "0.625rem" },
          md: { value: "0.875rem" },
          lg: { value: "1.125rem" },
          xl: { value: "1.375rem" },
          "2xl": { value: "1.625rem" },
          "3xl": { value: "1.875rem" },
          "4xl": { value: "2.25rem" }
        },
        shadows: {
          xs: { value: "0 1px 2px rgba(0, 0, 0, 0.04)" },
          sm: { value: "0 8px 24px rgba(0, 0, 0, 0.08)" },
          md: { value: "0 14px 34px rgba(0, 0, 0, 0.10)" },
          lg: { value: "0 20px 48px rgba(0, 0, 0, 0.14)" }
        }
      },
      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: {
              value: {
                _light: "#f4f4f5",
                _dark: "#0f0f10"
              }
            },
            subtle: {
              value: {
                _light: "#ededee",
                _dark: "#171718"
              }
            },
            muted: {
              value: {
                _light: "#e4e4e7",
                _dark: "#232326"
              }
            },
            panel: {
              value: {
                _light: "rgba(255, 255, 255, 0.82)",
                _dark: "rgba(24, 24, 24, 0.78)"
              }
            },
            field: {
              value: {
                _light: "rgba(255, 255, 255, 0.74)",
                _dark: "rgba(34, 34, 34, 0.82)"
              }
            }
          },
          border: {
            DEFAULT: {
              value: {
                _light: "rgba(23, 23, 23, 0.08)",
                _dark: "rgba(245, 245, 245, 0.12)"
              }
            },
            muted: {
              value: {
                _light: "rgba(23, 23, 23, 0.06)",
                _dark: "rgba(245, 245, 245, 0.09)"
              }
            },
            subtle: {
              value: {
                _light: "rgba(255, 255, 255, 0.72)",
                _dark: "rgba(255, 255, 255, 0.08)"
              }
            }
          }
        },
        shadows: {
          xs: {
            value: {
              _light: "0 1px 2px rgba(0, 0, 0, 0.04)",
              _dark: "0 1px 2px rgba(0, 0, 0, 0.28)"
            }
          },
          sm: {
            value: {
              _light: "0 8px 24px rgba(0, 0, 0, 0.08)",
              _dark: "0 8px 24px rgba(0, 0, 0, 0.3)"
            }
          },
          md: {
            value: {
              _light: "0 14px 34px rgba(0, 0, 0, 0.10)",
              _dark: "0 14px 34px rgba(0, 0, 0, 0.36)"
            }
          },
          lg: {
            value: {
              _light: "0 20px 48px rgba(0, 0, 0, 0.14)",
              _dark: "0 20px 48px rgba(0, 0, 0, 0.42)"
            }
          }
        }
      }
    }
  })
);
