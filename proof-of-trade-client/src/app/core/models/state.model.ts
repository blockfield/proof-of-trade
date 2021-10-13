export class StateModel {
    constructor(
        public state: string|null = null,
        public subState: string|null = null
    ) {}

    public setState(state: string|null): void {
        this.state = state
    }

    public setSubState(subState: string|null): void {
        this.subState = subState
    }
}