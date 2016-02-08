const exportDefaultContainerRegex = /export default .*\(([a-zA-Z]*)/
const exportDefaultRegex = /export default ([a-zA-Z]*)/
const classNameRegex = /className=\'([a-zA-Z\-\s]*)\'/g

function loader (source, inputSourceMap) {
  let matches = exportDefaultContainerRegex.exec(source) ||
    exportDefaultRegex.exec(source)

  if (matches) {
    let name = matches[1]

    source = source.replace(classNameRegex, (text, classNames) => {
      let prefixedClassNames = classNames
        .split(' ')
        .map((className) => {
          if (ignoreClassName(className, this.options.reactPrefixLoader)) return className

          return `${name}-${className}`
        })
        .join(' ')

      return `className='${prefixedClassNames}'`
    })
  }

  this.callback(null, source, inputSourceMap)
}

function ignoreClassName (className, options = {}) {
  return classMatchesTest(className, options.ignore) ||
    className.trim().length === 0 || /^[A-Z-]/.test(className)
}

function classMatchesTest (className, ignore) {
  if (!ignore) return false

  className = className.trim()

  if (ignore instanceof RegExp) return ignore.exec(className)

  if (Array.isArray(ignore)) {
    return ignore.some((test) => {
      if (test instanceof RegExp) return test.exec(className)

      return className === test
    })
  }

  return className === ignore
}

export default loader
