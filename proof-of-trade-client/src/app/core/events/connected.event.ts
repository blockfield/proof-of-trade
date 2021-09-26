export class ConnectedEvent {
    constructor(
        public address: string,
        public error: Error
    ) {}
}