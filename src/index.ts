import { Madoi } from "./madoi/madoi";
import { Room } from "./vroom";

window.addEventListener("load", function () {
    const m = new Madoi(`wss://fungo.kcg.edu/madoi-20211023/rooms/vroom-narlko4iw`);
    const room = new Room("#svg", 800, 600);
    const name = localStorage.getItem("name");
    m.register(room);
    m.onEnterRoom = selfId=>{
        const avator = room.newAvator(
            selfId,
            name != null ? name : "匿名",
            Math.random() * 300, Math.random() * 300);
        avator?.getCircle().attr({fill: '#0fa'});
        avator?.getGroup().draggable().on('dragmove', (e: any) => {
            const { handler, box } = e.detail;
            room.setPosition(selfId, box.x + box.width / 2, box.y + box.height / 2);
        });

        // ダブルクリックで名前変更
        let lastClick = new Date().getTime();
        avator?.getGroup().click(()=>{
            const t = new Date().getTime();
            if(t - lastClick < 300){
                const newName = window.prompt("名前を入力してください", avator.getName());
                if(newName){
                    avator.setName(newName);
                    room.changeName(selfId, newName);
                    localStorage.setItem("name", newName);
                }
            }
            lastClick = t;
        });
    };
});
