# Rusty Snake
A Snake game written in Rust, Compiled to Webassembly and run in a Javascript web application written in Typescript

## Development
### Rust
Make sure you have Rust installed.
`cargo install`
`cargo install wasm-pack`
`wasm-pack build --target web`
The last command will generate the WebAssembly code from you Rust library. You need to run this command every time you update your Rust code.

### Typescript
Make sure you have nodejs installed.
`npm install --prefix www`
`npm run dev --refix www`
This will start a webpack dev-server on port 8080 with hot reload. The WebAssembly project is installed by npm as a local package so when you generate a new WebAssembly package the dev server will reload with the latest updates.
