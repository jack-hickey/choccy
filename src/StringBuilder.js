export class StringBuilder {
    constructor() {
        this.Lines = [];
    }

    Append(content) {
        (this.Lines ??= ['']).at(-1) += content?.toString() ?? '';
    }

    AppendLine(content) {
        this.Lines.push(content);
    }

    toString() {
        return this.Lines.join();
    }
}