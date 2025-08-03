module.exports = {
  presets: [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        runtime: "automatic"  // for new JSX transform
      }
    ]
  ]
};