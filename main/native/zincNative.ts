import NativeCommunication from "./communication";

export class ZincNative {

    private nativeCommunication: NativeCommunication

    public constructor(nativeCommuniction: NativeCommunication) {
        this.nativeCommunication = nativeCommuniction;
    }

    public changeRPCDescription(description: string) {
        this.nativeCommunication.getWS().send(`custom:ChangeRPCDescription:${description}`);
    }
}