# ZIGZAG

## How to build

how to build:

```
bun install
bun dev
bunx tokenami --output ../../styles.css --watch --extra ./tokenami.css
```

the built main.js, styles.css and manifest.json will be in the root of the monorepo

## Notes

edited tokenami's cli.js so that instead of `:root`, it's `.theme-dark, .theme-light`
