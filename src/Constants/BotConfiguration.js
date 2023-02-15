export const BotConfiguration = new function () {
    // Time (in seconds) to wait before checking free games again
    this.FreeGameSetup = {
        Delay: 600,
        Subreddits: ['freegamefindings'],
        InvalidTitleMatches: ['(OTHER)', '(DLC)'],

        Embed: {
            Color: 11176191
        }
    };
}