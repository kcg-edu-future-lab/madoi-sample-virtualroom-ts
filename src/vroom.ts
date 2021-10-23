import { Container, Circle, G, Text, SVG, Image } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import { GetState, SetState, Share } from './madoi/madoi';

export class Room {
    private container: Container;
    private avators = new Map<string, Avator>();
    private validAvatorIds = new Set<string>();

    constructor(svgContainerSelector: string, width: number, height: number) {
        this.container = SVG().addTo(svgContainerSelector);
        this.container.size(width, height);
    }

    addValidAvatorId(peerId: string){
        this.validAvatorIds.add(peerId);
    }

    removeValidAvatorId(peerId: string){
        this.validAvatorIds.delete(peerId);
        const a = this.avators.get(peerId);
        if(a){
            this.avators.delete(peerId);
            a.remove();
        }
    }

    @Share({ type: "afterExec", maxLog: 1000 })
    newAvator(id: string, name: string, x: number, y: number) {
        if(!this.validAvatorIds.has(id)) return;
        const avator = new Avator(this.container, name);
        this.avators.set(id, avator);
        avator.setPosition(x, y);
        return avator;
    }

    @Share({ type: "afterExec", maxLog: 1000 })
    changeName(id: string, name: string) {
        const a = this.avators.get(id);
        a?.setName(name);
    }

    @Share({ type: "afterExec", maxLog: 1000 })
    setPosition(id: string, x: number, y: number) {
        const avator = this.avators.get(id);
        if (avator) {
            avator.setPosition(x, y);
        }
    }

    @GetState({ maxInterval: 5000, maxUpdates: 1000})
    getState(): string {
        const ret = [];
        for (const [id, a] of this.avators) {
            const [x, y] = a.getPosition();
            ret.push({
                "id": id, "name": a.getName(),
                "x": x, "y": y
            });
        }
        return JSON.stringify(ret);
    }

    @SetState()
    setState(state: string){
        const avators: any[] = JSON.parse(state);
        for (const a of avators) {
            const id = a.id;
            if(!this.validAvatorIds.has(id)) continue;
            const name = a.name;
            let avator;
            if(this.avators.has(id)){
                avator = this.avators.get(id)!;
            } else{
                avator = new Avator(this.container, name);
                this.avators.set(id, avator);
            }
            avator.setName(name);
            avator.setPosition(a.x, a.y);
        }
    }

    calcDistances(selfId: string): Map<string, number>{
        const ret = new Map<string, number>();
        const self = this.avators.get(selfId);
        if(!self) return ret;
        const [selfX, selfY] = self.getPosition();
        for (const [id, a] of this.avators){
            if(id == selfId) continue;
            const [ax, ay] = a.getPosition();
            const dist = Math.pow(selfX - ax, 2)
               + Math.pow(selfY - ay, 2);
            ret.set(id, dist);
        }
        return ret;
    }
}

export class Avator{
    private name: string = "匿名";
    private group: G;
    private circle: Circle;
    private text: Text;

    constructor(svg: Container, name: string){
        this.group = svg.group();
        this.name = name;
        this.circle = svg.circle(48).attr("fill", "#99aaFF");
        this.group.add(this.circle);
        const cbox = this.circle.bbox();
        this.text = svg.plain(this.name)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .center(
                cbox.x + cbox.width / 2,
                cbox.y + cbox.height / 2
            );
        this.group.add(this.text);
    }

    getName(): string{
        return this.name;
    }

    setName(name: string){
        this.name = name;
        this.text.plain(name);
    }

    getPosition(){
        return [this.group.cx(), this.group.cy()];
    }

    setPosition(x: number, y: number){
        this.group.center(x, y);
    }

    getGroup(){
        return this.group;
    }

    getCircle(){
        return this.circle;
    }

    remove(){
        this.group.remove();
    }
}
