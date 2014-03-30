/*
 * telescope
 * https://github.com/parroit/telescope
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */
define(["./Observable", "./ArrayObservable"],
    function(Observable, ArrayObservable) {
        "use strict";
        return {
            object: Observable,
            array: ArrayObservable
        };

    }
);
