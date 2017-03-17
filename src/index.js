const exportDefaultContainerRegex = /export\s+default\s+.*\(([A-Z][A-Za-z_\$\d]*)/
const exportDefaultRegex = /export\s+default(?:\s+class)?\s+([A-Z][A-Za-z_\$\d]*)/
const classNameRegex = /(className=(?:\{\s*c\(|\{\s*classnames\(|\{\s*)?\s*[\'\"\`]\s*)([a-z][a-zA-Z\d_\-]*)/g

function loader (source, inputSourceMap) {
  this.cacheable()
  let matches = source.match(exportDefaultContainerRegex) || source.match(exportDefaultRegex)

  if (matches) {
    let jsClassName = matches[1]

    source = source.replace(classNameRegex, (match, prefix, cssClassName) => {
      if (ignoreClassName(cssClassName, this.options.reactPrefixLoader)) return prefix + cssClassName
      if (cssClassName === 'root') return `${prefix}${jsClassName}`
      return `${prefix}${jsClassName}-${cssClassName}`
    })
  }

  this.callback(null, source, inputSourceMap)
}

function ignoreClassName (className, options = {}) {
  return classMatchesTest(className, options.ignore) || /^[A-Z-]/.test(className)
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
