const exportDefaultContainerRegex = /export default .*\(([a-zA-Z]*)/
const exportDefaultRegex = /export default ([a-zA-Z]*)/
const classNameRegex = /className=\'([a-zA-Z\-\s]*)\'/g
const needPrefixRegex = /^[a-z]/

function prefix (className, name) {
  if (needPrefixRegex.test(className)) return `${name}-${className}`

  return className
}

function loader (source, inputSourceMap) {
  let matches = exportDefaultContainerRegex.exec(source) ||
    exportDefaultRegex.exec(source)

  if (matches) {
    let name = matches[1]

    source = source.replace(classNameRegex, (text, classNames) => {
      let prefixedClassNames = classNames
        .split(' ')
        .map((className) => prefix(className, name))
        .join(' ')

      return `className='${prefixedClassNames}'`
    })
  }

  this.callback(null, source, inputSourceMap)
}

export default loader
