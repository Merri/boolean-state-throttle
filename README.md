# Boolean State Throttle

[![Version](http://img.shields.io/npm/v/boolean-state-throttle.svg)](https://www.npmjs.org/package/boolean-state-throttle)

You may want to display a top bar header floating fixed on the screen. However on mobile space is limited and there can
be a need to hide the header when scrolling down and bringing it back when scrolling up. You might have already seen
solutions like [Headroom.js](https://github.com/WickyNilliams/headroom.js) or
[sneakpeek](https://github.com/antris/sneakpeek). These often provide far more features than you may want to have,
especially if you are working with a framework such as React or maybe Angular. Boolean State Throttle handles the hard
logic for you, but doesn't provide full convenience in order to give more control to you. Due to this agnostic design
you can use whatever framework or library you want.

## Usage samples

Boolean state throttle is very convenient to use and gives you the power to handle exceptions!

1. You provide it a callback that is only called when the state changes.
2. You provide it a state boolean. This is the current display state of a header (or anything else).
3. You provide it a value every time you get an event (`onscroll`).

You can link it with horizontal scrolling or vertical scrolling. Or maybe you have checkboxes and if 10 checkboxes are
checked within 1 second you want to display a message. Boolean State Throttle works for all time depending changes that
are based on a numeric value.

### Vanilla ES5 JavaScript sample

[View demo](http://htmlpreview.github.io/?https://github.com/merri/boolean-state-throttle/blob/master/demo/index.html)

```js
(function() {
    var headerElement = document.querySelector('header'),
        notifyElement = document.getElementById('header-is-hidden')

    // this is our boolean state, owned and controlled by this component
    var isHidden = false

    function getScrollY() {
        return (window.pageYOffset !== undefined)
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop
    }

    // this function is only triggered when the boolean changes
    // you could optimize render by using requestAnimationFrame; or simply use setState in React
    function updateHeaderState(newState) {
        isHidden = newState
        notifyElement.className = headerElement.className = isHidden ? 'hidden' : ''
    }

    // convenience for you!
    var headerStateTrigger = new BooleanStateThrottle(updateHeaderState)

    function updateScrollValue() {
        var y = getScrollY()
        // one of the reasons to have the logic separate is that you can handle exceptions better!
        if (isHidden && y < 50) {
            // header should always be shown when at the top
            updateHeaderState(false)
        } else {
            // bombard the boolean state throttle
            headerStateTrigger(isHidden, y)
        }
    }

    window.addEventListener('scroll', updateScrollValue, false)
})()
```

### ReactJS sample

Code below only has the core logic for displaying and hiding a header; the actual render is up to you.

```jsx
var Component = React.createClass({
/* ... */
    getInitialState: function() {
        return {
            isHeaderHidden: false
        }
    },

    componentDidMount: function() {
        this.headerStateTrigger = new BooleanStateThrottle(this.updateHeaderState)
        window.addEventListener('scroll', this.updateScrollValue)
    },

    componentWillUnmount: function() {
        window.removeEventListener('scroll', this.updateScrollValue)
    },

    updateHeaderState: function(isHeaderHidden) {
        this.setState({ isHeaderHidden: isHeaderHidden })
    },

    updateScrollValue: function() {
        var y = (window.pageYOffset !== undefined)
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop

        if (this.state.isHeaderHidden && y < 50) {
            // header should always be shown when at the top
            this.updateHeaderState(false)
        } else {
            // bombard the boolean state throttle
            this.headerStateTrigger(isHidden, y)
        }
    }
/* ... */
})
```

## Customizing

`BooleanStateThrottle` takes two arguments: `callback` function (required) and `options` object (optional).

```js
// values shown are the defaults
var options = {
    // time in ms after which changes are checked for
    interval: 200,
    // how much value can change down until `false` state is triggered
    falseTolerance: 150,
    // how much value can change up until `false` state is triggered
    trueTolerance: 150,
    // tells the initial value
    initialValue: 0
}
```

## Compatibility

This utility is compatible with probably everything since Internet Explorer 5 or so.
