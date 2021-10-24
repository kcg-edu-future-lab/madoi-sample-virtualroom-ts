export declare function ShareClass(option?: any): (target: any) => void;
export interface ShareConfig {
    type?: "beforeExec" | "afterExec";
    maxLog?: number;
    allowedTo?: string[];
    update?: {
        freq?: number;
        interpolateBy?: number;
        reckonUntil?: number;
    };
}
export declare function Share(config?: ShareConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface GetStateConfig {
    maxInterval?: number;
    maxUpdates?: number;
}
export declare function GetState(config?: GetStateConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface SetStateConfig {
}
export declare function SetState(config?: SetStateConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface EnterRoomConfig {
}
export declare function EnterRoom(config?: EnterRoomConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface LeaveRoomConfig {
}
export declare function LeaveRoom(config?: LeaveRoomConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface PeerJoinConfig {
}
export declare function PeerJoin(config?: PeerJoinConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface PeerLeaveConfig {
}
export declare function PeerLeave(config?: PeerLeaveConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface MethodConfig {
    share?: ShareConfig;
    getState?: GetStateConfig;
    setState?: SetStateConfig;
    enterRoom?: EnterRoomConfig;
    leaveRoom?: LeaveRoomConfig;
    peerJoin?: PeerJoinConfig;
    peerLeave?: PeerLeaveConfig;
}
interface PeerInfo {
    id: string;
    order: number;
}
export interface MethodAndConfigParam {
    method: Function;
    share?: ShareConfig;
    getState?: GetStateConfig;
    setState?: SetStateConfig;
    enterRoom?: EnterRoomConfig;
    leaveRoom?: LeaveRoomConfig;
    peerJoin?: PeerJoinConfig;
    peerLeave?: PeerLeaveConfig;
}
export declare class Madoi {
    private connecting;
    private interimQueue;
    private sharedFunctions;
    private sharedObjects;
    private getStateMethods;
    private setStateMethods;
    private enterRoomMethods;
    private leaveRoomMethods;
    private peerJoinMethods;
    private peerLeaveMethods;
    private promises;
    private changedObjects;
    private handlers;
    private ws;
    private selfPeerId;
    private currentSenderPeerId;
    constructor(servicePath: string, key?: string, options?: {});
    getCurrentSenderPeerId(): string | null;
    isSelfCall(): boolean;
    close(): void;
    private handleOnOpen;
    private handleOnClose;
    private handleOnError;
    private handleOnMessage;
    private data;
    onOpen(_e: Event): void;
    onClose(_e: Event): void;
    onError(_e: Event): void;
    onElse(_msg: any): void;
    onEnterRoom(selfPeerId: string, peerIds: PeerInfo[]): void;
    onLeaveRoom(): void;
    onPeerJoin(peerId: string): void;
    onPeerLeave(peerId: string): void;
    send(type: string, body: object, headers: object): void;
    sendMessage(msg: object): void;
    register(obj: any, methodAndConfigs?: MethodAndConfigParam[]): void;
    registerFunction(func: Function, config: ShareConfig): () => any;
    private addSharedFunction;
    saveStates(): void;
    private applyInvocation;
}
export {};
