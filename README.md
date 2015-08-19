## Technical details

### Application Source Codes

JavaScript was born without an official module management.
But as web pages grown up more complex and more requirements about user experience,
codes of front-end is heavier than heavier.
Limiting special function in suitable module and exposing public apis for calling,
become necessary, and after years evolutions (from using global namespase), there are three popular ways
([AMD, CommonJS, ES import/export](http://addyosmani.com/writing-modular-js/)) to let us
write modular JavaScript.

[Web components](http://webcomponents.org/) still follow the same principle,
but expanded to all things about front-end.

So, [Riot](https://github.com/riot/riot) usages in the project, need to follow.

```xml

<component>
  <link rel='import' href='path/to/other-component.tag.html'/>

  <other-component prop_a='{1}' prop_b='{1}'/>

  <script src='path/to/component-controller.js'>
</component>

```

The transformer [import-riotify](https://github.com/morlay/import-riotify) will help to make riot could be used in this way.

Before we compile riot, we can pre-transform the code above to this:

```js
// For riot tag, we can use in this way, but it is not scoped tag,
// It is global !!!!
// So we have to make sure the tag name is unique.
import 'path/to/other-component.tag.html'
import controller from 'path/to/component-controller.js'

<component>
  <other-component prop_a='{1}' prop_b='{1}'/>
  <script>
    controller.call(this, opts)
  </script>  
</component>
```

#### Code Structure

L.I.F.T. Learn from <https://github.com/johnpapa/angular-styleguide#application-structure-lift-principle>

#### The reflux-riot

Since the Flux be formulated, there are so many mutation libraries in community.
[Reflux](https://github.com/reflux/refluxjs) is one of them which join the Dispatcher and the Actions.
It is only for data management

And when data change we will trigger the event and notice any View which is listen to the data Store.

Then [reflux-core](https://github.com/reflux/reflux-core) is not related the React,
and we can integrate it with riot with small size.

more details in code `src-admin/utils/reflux-riot`

When Application become bigger, will be easy to change Riot to another View library.

#### The riot-router

Core codes are copied from <https://github.com/gabrielmoreira/riot-router>

and let it support query parameters

and easier configures for routes

more details in code `src-admin/utils/riot-router`
(router will be strongly related with the View, and not found a general way)

#### Riot tips

Riot is a smaller library, and some usefully processing is not like other frameworks.

##### Component Scope

Be similar like the Angular directives, when we use some custom tags or attributes,
must be careful about the data scope.

current version 2.2.4 will have this rules

* `each` will change scope

```xml
<component>
  <li each='{item in list}'>
    <a onclick='{parent.handleClick}'> {item.value} </a>
  </li>
</component>
```

* custom component will change scope

```xml
<component>
  <custom-component>
    <a onclick='{parent.handleClick}'> {item.value} </a>
  </custom-component>
</component>
```

##### HTML attributes vs Custom property

As html attributes are not support camel case, when we set the props of custom components,
we may not use camel case things.

```xml
<custom-component/>
  <script>
    opts.propA; // return undefined
    opts.propa; // return data
    opts.prop_b; // return data
    opts['prop-c']; // return data
  </script>  
</custom-component>
<component>
  <custom-component
    propA='{data}'
    prop_b='{data}'
    prop-c='{data}'
  />
</component>
```

And when use some reserved html attributes like `selected`, `disabled`
(more list checked <https://github.com/riot/riot/blob/master/lib/shared/compiler.js#L1>)

it will be translate to `__selected`, `__disabled`,
so when we create custom component, should add the prefix `__`

```xml
<custom-component/>
  <script>
    opts.selected; // return undefined
    opts.__selected; // return true
  </script>  
</custom-component>
<component>
  <custom-component selected/>
</component>
```

##### jQuery still here

Riot said it is React-like, but it is not. It still stay in template engine,
which will replace all placeholder in template string before component mount or update, then handle the DOM directly.

And when use use jQuery in riot, should clear when we can get `this.root` (after mount).

sometimes, we have to use `setTimeout` to do some ugly hacks.

### Build pipelines

`gulp.config` (`tasks/libs/tasks/libs/gulp-task-config.js`)
the set/get method to help management configures of task.

#### Structure

```
/config
    some-task.js
some-task.js  
```

#### Configure rules

```js
export default {
  entry: 'path/to/entry/file',
  src: ['path/to/with/patterns'],
  dest: 'path/to/dest',
  options: {
   // options in build task
  }
}
```

```js
export default {
  files: [{
    entry: 'path/to/entry/file',
    src: ['path/to/with/patterns'],
    dest: 'path/to/dest',
    options: {
      // options for special file or file group in build task
    }
  }],
  options: {
     // shared options for all files in build task
  }
}
```

#### Defined a task

see `tasks/*.js`


### Browserify

Most of details we can find in substack's [browserify-handbook](https://github.com/substack/browserify-handbook)

#### Compiled results

All source code should follow the CommonJS rules (ES6 import/export is the same)
and each module will be wrapper with the code below and join in one file, without globals:

```js
{
  1: [
    function(require, module, exports){
      // source code here
      var _ = {}
      _.map = function (array, callback) {
        return array.map(callback)
      }
      module.exports = {}
    },
    {}
  ],
  2: [
    function(require, module, exports){
      // source code here
      var _ = require('lodash')
      var namespace = {}  

      namespace.foo = function () {
         _.map([1, 2, 3],function () {})
      }

      module.exports = namespace;
    }, {
      'lodash': 1 // this is index of Linked List, to make javascript faster to find the dependences when running
    }
  ],
  ...
}
```

Another tool - [webpack](http://webpack.github.io/) have the similar structure.

In this way, we can package non-javascript things with transformers.

#### Transform

Transform is useful thing in browserify (for webpack this be called `loader`).
With transformer's help, our code could write like below:

```css
  .component {}
```

```html
  <h1><%= heading %></h1>
```

``` js
{
  1: [
    function (require, module, exports) {
      var insertCss = require('insert-css')
      var cssString = '.component {}'
      insertCss(cssString)
      module.exports = cssString;
    }, {}
  ],
  2: [
    function (require, module, exports) {
      module.exports = '<h1><%= heading %></h1>';
    }, {}
  ],
  3: [
    function (require, module, exports) {
      // source code here
      var cssString ＝ require('./index.css')
      var templateString ＝ require('./index.tpl.ejs')
      var _ = require('lodash')

      document.write(_.template(templateString)({
         heading: 'I\'m the heading'
      }))
      // entry file not need exports
    }, {
      './index.css': 1,
      './index.tpl.ejs': 2,
      'insert-css': 'insert-css'
      'lodash': 'lodash'
    }
  ],
  ...
}
```
and in the finally result, we can easy to split them in different module files.

##### babelify

ECMAScript 2015(ECMAScript 6) have been ratification in June 2015.
Without waiting the browsers support,
We can use [babel](http://babeljs.io/) to transform code to make it work well in current browsers.

And in use with browserify(or webpack),
we need use a special configure - `runtime`

```js
{
  "optional": [
     "runtime"
  ]
}
```
otherwise, transforming helper codes will be add in each module.

##### envify

Sometimes, we need to add some debug code when in non-production environment.

```js
  if (process.env.NODE_ENV !== 'production') {
    // in non-production environment
  }
```

We can keep them in code base, and when run build pipeline with `NODE_ENV=production`,
this code block will be cleaned in production code.

For more configures, if needed,
[config](https://www.npmjs.com/package/config) and [envify-config](https://www.npmjs.com/package/envify-config),
will be helpful.


### Keep npm updated

`npm run check-updates` could do this in this project. it is powered by [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

### Testing

Now only have eslint to make sure code keep clean.
Code style could be defined in `.eslintrc`.

In further project, unit testing may be covered.
[mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai) are the cool pair.
[sinon](https://www.npmjs.com/package/sinon) will be help doing mocks.

View alway be tested by human, if want run with e2e, [webdriver](https://www.npmjs.com/package/wd) is cool.
And just want to check about base dom render, [jsdom](https://www.npmjs.com/package/jsdom) or [cheerio](https://www.npmjs.com/package/cheerio) will be useful.
