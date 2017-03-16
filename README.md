# react-prefix-loader

A Webpack loader that prefixes classes in React components  
The idea is to isolate styles in framework components

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### Simple example

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

### Complex example

MyComponent.jsx

```jsx
@connect(state => ({foo: state.foo}))
export default class MyComponent extends React.Component {
  render () {
    return (
      <div className={c(`root ${this.props.className} -hello`, {
        '-selected': true
      })}
        <div className='title'></div>
        <table className='-wide'></table>
        <div className='Avatar'></div>
        <div className={classnames('left', {})}></div>
        <div className={classnames('Topbar-left', {})}></div>
        <div className={c("body " + this.props.className)}></div>
        <div className='title'></div>
        <div className={"body " + this.props.className}></div>
      </div>
    )
  }
}
```

Output:

```jsx
@connect(state => ({foo: state.foo}))
export default class MyComponent extends React.Component {
  render () {
    return (
      <div className={c(`MyComponent ${this.props.className} -hello`, {
        '-selected': true
      })}
        <div className='MyComponent-title'>Title</div>
        <table className='-wide'></table>
        <div className='Avatar'></div>
        <div className={classnames('MyComponent-left', {})}></div>
        <div className={classnames('Topbar-left', {})}></div>
        <div className={c("MyComponent-body " + this.props.className)}></div>
        <div className='MyComponent-title'></div>
        <div className={"MyComponent-body " + this.props.className}></div>
      </div>
    )
  }
}
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
