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

Features:
- lower-case classes are prefixed with the `ComponentName`: 
  - `title` --> `ComponentName-title`
  - `content` --> `ComponentName-content`
  - `leftListItem` --> `ComponentName-leftListItem`
- `root` is a treated as a special class name and will be replaces with the `ComponentName`:
  - `root` --> `ComponentName`
- supports `className`s which have the value of either a string or a `{}` binding:
    ```jsx
    className='title'
    className={`title ${this.props.className}`}
    className={"title " + this.props.className}
    ```
- within `{}` binding it also does the replacement if the `classnames` function is called (as `classnames` or as `c`):
    ```jsx
    className={c('title', {'-active': true})}
    className={classnames(`title ${this.props.className}`, {
      '-active': true
    }}
    ```

Ignores:
- filenames that starts from not capital letter
- modifiers (classes that starts from hyphen)
- classes that starts from capital letter

Caveats:
- the class name to replace be the very first class name within the `className` attribute.
  
  For example, in `className='Form item'` the `item` won't get prefixed:
  - `className='Form item'` --> `className='Form item'`
  
  If you want it to be prefixed, just place it first:
  - `className='item Form'` --> `className='MyComponent-item Form'`
- searches for `export default ComponentName` or `export default class ComponentName` construction to find component name

## Installation

```
npm install react-prefix-loader
```

## License

MIT

## Recommendation

* Use it with [postcss-filename-prefix](https://github.com/vmakhaev/postcss-filename-prefix) for css files
