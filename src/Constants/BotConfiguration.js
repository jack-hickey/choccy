export const BotConfiguration = new function () {
    this.DevelopmentGuild = '822900454714376212';

    this.FreeGameSetup = {
        // Time (in seconds) to wait before checking free games again
        Delay: 600,
        Subreddits: ['freegamefindings'],
        InvalidTitleMatches: ['(OTHER)', '(DLC)'],

        Embed: {
            Color: 11176191
        },

        RecognizedPlatforms: [
            { match: 'UPLAY', conversion: 'Ubisoft' },
            { match: 'UBISOFT', conversion: 'Ubisoft' },
            { match: 'EPIC', conversion: 'Epic Games' },
            { match: 'EPIC GAMES', conversion: 'Epic Games' },
            { match: 'STEAM', conversion: 'Steam' },
            { match: 'GOG', conversion: 'GOG' },
            { match: 'INDIEGALA', conversion: 'IndieGala' },
            { match: 'BATTLE.NET', conversion: 'Battle.net' },
            { match: 'ITCH.IO', conversion: 'itch.io' },
            { match: 'GX.GAMES', conversion: 'Opera GX Games' }
        ]
    };
}