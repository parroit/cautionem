/*
 * model
 * https://github.com/parroit/model
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
    articoloIva:require("./ArticoliIva"),
    cliente:require("./Cliente"),
    enhanceFattura:require("../isomorphic/model/enhance-fattura"),
    enhanceRigaFattura:require("../isomorphic/model/enhance-rigafattura"),
    fattura:require("./Fattura.js"),
    rigaFattura:require("./RigaFattura.js"),
    tipiPagamento:require("./TipiPagamento.js")
};
