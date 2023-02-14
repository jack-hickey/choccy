import 'dotenv';
import Enmap from 'enmap';
import { Choccy } from './Choccy.js';
import { Settings } from './Constants/Settings.js';
import { RedditEngine } from './Reddit/RedditEngine.js';

Enmap.prototype.getValue = function (key, path) {
    return this.ensure(key, Settings.DefaultValue, path) ?? Settings.DefaultValue;
}

const freeGamesSubreddit = "freegamefindings";

const choccy = new Choccy();
choccy.Initialize();

const reddit = new RedditEngine();

function tryGetFreeGame() {
    reddit.GetLatestPost(freeGamesSubreddit).then(response => {

    });
}