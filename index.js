// typeof is fastest way to check if a function but older IEs don't support it for that and Chrome had a bug
var canTypeOfFn = typeof throttle === 'function' && typeof /./ !== 'function'

function throttle(func, wait) {
    var timeout
    return function() {
        var context = this, args = arguments
        if (!timeout) {
            timeout = setTimeout(function() {
                timeout = null
            }, wait)
            func.apply(context, args)
        }
    }
}

function BooleanStateThrottle(callback, options) {
    if (canTypeOfFn
        ? typeof callback !== 'function'
        : Object.prototype.toString.call(callback) !== '[object Function]') {
        throw new Error('First argument must be a callback function')
    }

    options = options || {}

    var TRIGGER_MS = ~~options.interval || 200
    var TRIGGER_ON_DECREASE = ~~options.falseTolerance || 150
    var TRIGGER_ON_INCREASE = ~~options.trueTolerance || 150
    var previousValue = ~~options.initialValue

    return throttle(function(state, value) {
        value = ~~value

        if (!state) {
            if ((value - previousValue) >= TRIGGER_ON_INCREASE) {
                callback(true)
            }
        } else {
            if ((previousValue - value) >= TRIGGER_ON_DECREASE) {
                callback(false)
            }
        }

        previousValue = value
    }, TRIGGER_MS)
}

module.exports = BooleanStateThrottle
