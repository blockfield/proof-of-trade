export class ConnectedEvent {
    constructor(
        public address: string|null,
        public error: Error
    ) {}
}