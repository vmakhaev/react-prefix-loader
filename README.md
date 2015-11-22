# react-prefix-loader

A Webpack loader that prefixes classes in React components  
The idea is to isolate styles in framework components

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

MyComponent.jsx

```jsx
class MyComponent extends React.Component {
  render () {
    return <div className='myclass'></div>
  }
}

export default MyComponent
```

Output:

```jsx
class MyComponent extends React.Component {
  render () {
    return <div className='MyComponent-myclass'></div>
  }
}

export default MyComponent
```

Ignores:
- filenames that starts from not capital letter
- modifiers (classes that starts from hyphen)
- classes that starts from capital letter

Caveats:
- searches for 'export default ComponentName' construction to find component name
- prefixes only className fields that are set as string

## Installation

```
npm install react-prefix-loader
```

## License

MIT

## Recommendation

* Use it with [postcss-filename-prefix](https://github.com/vmakhaev/postcss-filename-prefix) for css files
