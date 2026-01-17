/** @typedef {{ isDown: boolean }} Key */


export default class Input {
    /** @type {Map<string, Key>} */
    keys = new Map();
    downListener;
    upListener;
    
    constructor(){
        this.downListener = document.addEventListener("keydown", (e) => {
            for (const [key, keyObj] of this.keys) {
                if (key == e.code){
                    keyObj.isDown = true;
                }
            }
        })

        this.upListener = document.addEventListener("keyup", (e) => {
            for (const [key, keyObj] of this.keys) {
                if (key == e.code){
                    keyObj.isDown = false;
                }
            }
        })
    }

    addKey(key){
        if (this.keys.has(key)){
            return this.keys.get(key);
        } else {
            const newKey = { isDown: false }
            this.keys.set(key, newKey);
            return newKey;
        }
    }
}