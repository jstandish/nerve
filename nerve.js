(function () {

    var routes = [];

    function findSubscriber(callReference, array) {
        if (!array)
            return null;

        var i = 0, len = array.length;
        for (; i < len; i++) {
            if (array[i].callee === callReference)
                return array[i];
        }

        return null;
    }


    window.nerve = {

        on: function (channel, route, callback, scope) {
            /// <summary>Listen to a given channel or listen to a channel and route combination</summary>
            /// <param name="channel" type="String">The category of a an event</param>
            /// <param name="route" optional="true" type="String">The sub category of an event</param>
            /// <param name="callback" type="Function">A callback to to handle the event</param>
            /// <param name="scope" type="Function">The scope reference you are calling about</param>

            var c = channel, r = null, cb = null, caller = null;
            if (arguments.length == 1) {
                throw Error('A channel and a callback must be specified');
            } else if (arguments.length == 2) {
                if (Object.prototype.toString.call(arguments[1]) == "[object Function]") {
                    cb = arguments[1];
                    caller = arguments.callee;
                }
            } else if (arguments.length == 3 && Object.prototype.toString.call(arguments[1]) == "[object Function]") {
                if (Object.prototype.toString.call(arguments[1]) == "[object Function]") {
                    cb = arguments[1];
                    caller = arguments[2] || arguments.callee;
                } else {
                    throw Error('Last parameter must be a callback function');
                }
            } else if (arguments.length == 4) {
                c = channel;
                r = route;
                cb = callback;

                caller = scope || arguments.callee;
            }

            if (!cb) {
                return;
            }


            if (!routes[channel]) {

                //--- check on route
                routes[channel] = [];
            }

            if (!r) {
                r = 'root';
            }

            if (r && !routes[channel][r]) {
                routes[channel][r] = [];
            }


            //--- check to make sure we aren't adding ourselves twice
            if (findSubscriber(caller, routes[channel][r]))
                return;

            routes[channel][r].push({
                callee: caller,
                callback: cb
            });

        },

        off: function (channel, route, scope) {
            if (routes[channel]) {
                var r = 'root', caller = scope || arguments.callee;

                if (route) r = route;

                if (!routes[channel][r]) return;

                var i = 0, len = routes[channel][r];
                for (; i < len; i++) {
                    if (routes[channel][r][i].callee === caller)
                        delete routes[channel][r][i];
                }
            }
        },

        send: function (channel, route, context) {
            /// <summary></summary>
            /// <param name="channel" type="Object"></param>
            /// <param name="route" type="Object"></param>
            /// <param name="context" type="Object"></param>
            var r = 'root', ctx = null;

            if (arguments.length == 2) {
                ctx = arguments[1];
            } else if (arguments.length == 3) {
                r = route;
                ctx = context;
            }

            if (!routes[channel] || !routes[channel][r]) {
                return;
            }

            var listeners = routes[channel][r], i = 0, len = listeners.length;

            for (; i < len; i++) {

                (function (ch, rt, idx) {
                    var ref = setTimeout(function () {
                        routes[ch][rt][idx].callback(ctx);
                        clearTimeout(ref);
                    });
                })(channel, r, i);
            }
        }
    };
}
)();
