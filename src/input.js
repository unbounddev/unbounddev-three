/** @typedef {{ isDown: boolean }} Key */


export const EIGHT_BITDO_ULTIMATE_2C_MAPPING = {
    "A": 0,
    "B": 1,
    "X": 2,
    "Y": 3,
    "LB": 4,
    "RB": 5,
    "MINUS": 6,
    "PLUS": 7,
    "HOME": 8,
    "LSB": 9,
    "RSB": 10
}

export const EIGHT_BITDO_ULTIMATE_2C_AXES = {
    "LSX": 0,
    "LSY": 1,
    "LT": 2,
    "RSX": 3,
    "RSY": 4,
    "RT": 5,
    "DX": 6,
    "DY": 7
}

export default class Input {
    /** @type {Map<string, Key>} */
    keys = new Map();
    downListener;
    upListener;
    connectedListener;
    disconnectedListener;
    gamepads = [];
    
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

        // this.connectedListener = window.addEventListener("gamepadconnected", (e) => {
        //     this.gamepadHandler(e, true);
        // })

        // this.disconnectedListener = window.addEventListener("gamepaddisconnected", (e) => {
        //     this.gamepadHandler(e, false);
        // })
    }

    /** 
     * @param {string} key (key code)
     * @returns {Key} 
     */
    addKey(key){
        if (this.keys.has(key)){
            return this.keys.get(key);
        } else {
            const newKey = { isDown: false }
            this.keys.set(key, newKey);
            return newKey;
        }
    }

    // gamepadHandler(e, connected){
    //     const gamepad = e.gamepad;

    //     console.log(e)

    //     if (connected){
    //         this.gamepads[gamepad.index] = gamepad;
    //     } else {
    //         this.gamepads[gamepad.index];
    //     }
    // }

    update(){
        this.gamepads = navigator.getGamepads()
    }
}