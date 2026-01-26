/** @typedef {{ isDown: boolean }} Key */

// Vendor: 2dc8 Product: 310a 8BitDo Ultimate 2C 

const STANDARD_MAPPING = {
    BUTTONS: {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,
        LB: 4,
        RB: 5,
        LT: 6,
        RT: 7,
        CENTER_LEFT: 8,
        CENTER_RIGHT: 9,
        LS: 10,
        RS: 11,
        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
        CENTER: 16
    },
    AXES: {
        LSX: 0,
        LXY: 1,
        RSX: 2,
        RSY: 3
    }
}


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

/** @interface */
class ControllerMapping {
    /** @type {string} */
    product;
    /** @type {string} */
    vendor;
    convertToStandard() { }   
}

/** @implements {ControllerMapping} */
class Ultimate2CMapping {
    product = "310a";
    vendor = "2dc8";
    convertToStandard(/** @type {Gamepad} */gamepad) {
        const newGamepad = {
            id: gamepad.id,
            mapping: "standard",
            connected: gamepad.connected,
            hapticActuators: gamepad.hapticActuators || [],
            vibrationActuator: gamepad.vibrationActuator,
            index: gamepad.index,
            timestamp: gamepad.timestamp
        }
        let buttons = gamepad.buttons;
        let axes = gamepad.axes;
        let buttonMapping = EIGHT_BITDO_ULTIMATE_2C_MAPPING;
        let axesMapping = EIGHT_BITDO_ULTIMATE_2C_AXES;
        newGamepad.buttons = [
            buttons[buttonMapping.A],
            buttons[buttonMapping.B],
            buttons[buttonMapping.X],
            buttons[buttonMapping.Y],
            buttons[buttonMapping.LB],
            buttons[buttonMapping.RB],
            {
                pressed: axes[axesMapping.LT] > -1,
                value: axes[axesMapping.LT]
            },
            {
                pressed: axes[axesMapping.RT] > -1,
                value: axes[axesMapping.RT]
            },
            buttons[buttonMapping.MINUS],
            buttons[buttonMapping.PLUS],
            buttons[buttonMapping.LSB],
            buttons[buttonMapping.RSB],
            {
                pressed: axes[axesMapping.DY] == -1,
                value: axes[axesMapping.DY]
            },
            {
                pressed: axes[axesMapping.DY] == 1,
                value: axes[axesMapping.DY]
            },
            {
                pressed: axes[axesMapping.DX] == -1,
                value: axes[axesMapping.DX]
            },
            {
                pressed: axes[axesMapping.DX] == 1,
                value: axes[axesMapping.DX]
            },
            buttons[buttonMapping.HOME]
        ]
        newGamepad.axes = [
            axes[axesMapping.LSX],
            axes[axesMapping.LSY],
            axes[axesMapping.RSX],
            axes[axesMapping.RSY]
        ]
    }
}

/** @type {ControllerMapping[]} */
const mappings = [new Ultimate2CMapping()]

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
        this.gamepads = [];
        for (let gamepad of navigator.getGamepads()){
            let gamepadAdded = false;
            if (gamepad == null){
                this.gamepads.push(gamepad)
                gamepadAdded = true;
            } else if (gamepad.mapping == "standard"){
                this.gamepads.push(gamepad);
                gamepadAdded = true;
            } else {
                for (let mapping of mappings){
                    let gamepadId = gamepad.id.toLowerCase();
                    let mappingProduct = mapping.product.toLowerCase();
                    let mappingVendor = mapping.vendor.toLowerCase();
                    if (gamepadId.includes(mappingProduct) && gamepadId.includes(mappingVendor)){
                        mapping.convertToStandard(gamepad);
                        this.gamepads.push(gamepad);
                        gamepadAdded = true;
                    }
                }
            }
            if (!gamepadAdded){
                this.gamepads.push(gamepad);
                console.error("Mapping for gamepad could not be found", gamepad);
            }
        }
    }
}