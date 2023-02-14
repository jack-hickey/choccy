import 'dotenv';
import { Choccy } from './Choccy.js';
import { RedditEngine } from './Reddit/RedditEngine.js';

const freeGamesSubreddit = "freegamefindings";

const choccy = new Choccy();
choccy.Initialize();

const reddit = new RedditEngine();

function tryGetFreeGame() {
    reddit.GetLatestPost(freeGamesSubreddit).then(response => {

    });
}