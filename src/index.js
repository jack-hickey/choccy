import 'dotenv';
import Enmap from 'enmap';
import { Choccy } from './Choccy.js';
import { Settings } from './Constants/Settings.js';

Enmap.prototype.getValue = function (key, path) {
    return this.ensure(key, Settings.DefaultValue, path) ?? Settings.DefaultValue;
}

Date.prototype.toUTC = function(){
    return Date.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(),
        this.getUTCMinutes(), this.getUTCSeconds());
}

const choccy = new Choccy();
choccy.Initialize();