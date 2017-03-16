import assert from 'assert'
import loader from '../src/index'

const classNameRegex = /(className=(?:\{\s*c\(|\{\s*classnames\(|\{\s*)?\s*[\'\"\`]\s*)([a-z][a-zA-Z\d_\-]*)/
let classNameTests = [
  {in: 'className=\'root\'', out: 'root'},
  {in: 'className=\'Root\'', out: false},
  {in: 'className="root"', out: 'root'},
  {in: 'className="Root"', out: false},
  {in: 'className={"root " + this.props.className}', out: 'root'},
  {in: '<div className={"body " + this.props.className}></div>', out: 'body'},
  {in: 'className={\'root \' + this.props.className}', out: 'root'},
  {in: 'className={`body${this.props.hello}` + this.props.className}', out: 'body'},
  {in: 'className={c(\'root Hello\', {} ) }', out: 'root'},
  {in: 'className={ c( \'root Hello\', {} ) }', out: 'root'},
  {in: 'className={classnames(\' root Hello\', {} ) }', out: 'root'},
  {in: 'className={ classnames( \'  root Hello\', {} ) }', out: 'root'},
  {in: 'className={c(\'Hello root\')}', out: false},
  {in: 'className={c(\`root${\' hello\'}\`)}', out: 'root'},
  {in: 'className={c(\`root ${classNames}\`, {\'-selected\': true})}', out: 'root'},
  {in: 'className={c(\"root-hello\", {\'-selected\': true})}', out: 'root-hello'},
  {in: 'className={c(\"Hello\", {\'-selected\': true})}', out: false}
]

describe('className regexps', () => {

  classNameTests.forEach(testItem => {
    it(testItem.in, () => {
      let match = testItem.in.match(classNameRegex)
      if (testItem.out) {
        assert.equal(!!(match && match[1] && match[2]), true)
        assert.deepEqual(match[2], testItem.out)
      } else {
        assert.equal(match, null)
      }
    })
  })

})

const exportDefaultRegex = /export\s+default(?:\s+class)?\s+([A-Z][A-Za-z_\$\d]*)/
let exportDefaultTests = [
  {in: 'export default MyClass', out: 'MyClass'},
  {in: 'export   default   MyClass', out: 'MyClass'},
  {in: 'export default class MyClass', out: 'MyClass'},
  {in: 'export   default   class   MyClass', out: 'MyClass'},
  {in: 'export default class MyClass222 extends React.Component {', out: 'MyClass222'},
  {in: 'export   default   class   MyClass222   extends   React.Component   {', out: 'MyClass222'},
  {in: 'export default myClass', out: false},
  {in: 'export default class myClass', out: false},
  {in: 'export default 2MyClass', out: false},
  {in: 'export default class 2MyClass', out: false},
]

describe('export default regexps', () => {

  exportDefaultTests.forEach(testItem => {
    it(testItem.in, () => {
      let match = testItem.in.match(exportDefaultRegex)
      if (testItem.out) {
        assert.equal(!!(match && match[1]), true)
        assert.deepEqual(match[1], testItem.out)
      } else {
        assert.equal(match, null)
      }
    })
  })

})

const exportDefaultContainerRegex = /export\s+default\s+.*\(([A-Z][A-Za-z_\$\d]*)/
let exportDefaultContainerTests = [
  {in: 'export default MyClass', out: false},
  {in: 'export default connect(MyClass)', out: 'MyClass'},
  {in: 'export default subscribe(connect(MyClass))', out: 'MyClass'},
  {in: 'export default connect(myClass)', out: false},
  {in: 'export default subscribe(connect(myClass))', out: false},
  {in: 'export default connect(2MyClass)', out: false},
  {in: 'export default subscribe(connect(2MyClass))', out: false},
]

describe('export default container regexps', () => {

  exportDefaultContainerTests.forEach(testItem => {
    it(testItem.in, () => {
      let match = testItem.in.match(exportDefaultContainerRegex)
      if (testItem.out) {
        assert.equal(!!(match && match[1]), true)
        assert.deepEqual(match[1], testItem.out)
      } else {
        assert.equal(match, null)
      }
    })
  })

})

let loaderFunctionalTest = {
  in: `
    export  default  class  MyClass  extends  React.Component {
      render () {
        return (
          <div className={c(\`root \${this.props.className} -hello\`, {
            '-selected': true
          })}
            <div className='title'></div>
            <div className='title'></div>
            <div className='title'></div>
            <div className='-something'></div>
            <div className='title'></div>
            <div className='Something'></div>
            <div className={classnames('left', {})}></div>
            <div className={classnames('Topbar-left', {})}></div>
            <div className={"body " + this.props.className}></div>
            <div className={c("body " + this.props.className)}></div>
            <div className='title'></div>
            <div className={"body " + this.props.className}></div>
          </div>
        )
      }
    }
  `, out: `
    export  default  class  MyClass  extends  React.Component {
      render () {
        return (
          <div className={c(\`MyClass \${this.props.className} -hello\`, {
            '-selected': true
          })}
            <div className='MyClass-title'></div>
            <div className='MyClass-title'></div>
            <div className='MyClass-title'></div>
            <div className='-something'></div>
            <div className='MyClass-title'></div>
            <div className='Something'></div>
            <div className={classnames('MyClass-left', {})}></div>
            <div className={classnames('Topbar-left', {})}></div>
            <div className={"MyClass-body " + this.props.className}></div>
            <div className={c("MyClass-body " + this.props.className)}></div>
            <div className='MyClass-title'></div>
            <div className={"MyClass-body " + this.props.className}></div>
          </div>
        )
      }
    }
  `
}
describe.only('loader', () => {

  it('big functional test of loader', () => {
    let context = {
      options: {},
      cacheable: () => {},
      callback: (err, transformedSource) => {
        assert.equal(err, null)
        assert.deepEqual(transformedSource, loaderFunctionalTest.out)
      }
    }
    loader.call(context, loaderFunctionalTest.in)
  })

})
