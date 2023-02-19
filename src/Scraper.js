export const Scraper = new function () {
    this.GetMetaData = async function (url) {
        const html = await (await fetch(url, { method: "GET", headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59' } })).text(),
            returnObject = {};

        return new Promise(resolve => {
            const matchedData = [...html.matchAll(/meta.*?property\=\"(?<name>.*?)\".*?content\=\"(?<value>[A-Za-z0-9 _].*?)\"/g)]
                .map(x => x.groups).filter(x => x?.name !== undefined && x?.value !== undefined);

            matchedData.forEach(set => {
                returnObject[set.name] = set.value;
            });

            resolve(returnObject);
        })
    }
}