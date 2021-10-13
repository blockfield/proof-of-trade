import { ProviderStatusEnum } from "../enums/provider-status.enum";

export class ConnectionModel {
    constructor(
        public status: ProviderStatusEnum
    ) {}

    public setConnectionStatus(status: ProviderStatusEnum): void {
        this.status = status
    }

    public isConnectable(): boolean {
        return [ProviderStatusEnum.DISCONNECTED, ProviderStatusEnum.CONNECTING].includes(this.status)
    }

    public isDisconnectable(): boolean {
        return [ProviderStatusEnum.CONNECTED].includes(this.status)
    }
}