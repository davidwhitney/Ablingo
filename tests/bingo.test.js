const { Identity, BingoCard, BingoCaller, BingoBlock, BingoCardGenerator } = require("../bingo.js");

describe("Identity", async () => {
    it("Generates id on creation", async () => {        
        const sut = new Identity("friendly name");
        expect(sut.clientId).toBeDefined();
        expect(sut.friendlyName).toBe("friendly name");
    });
});

describe("BingoCard", async () => {
    it("Can be created", async () => {        
        const sut = new BingoCard();
        expect(sut).toBeDefined();
    });
});

describe("BingoCaller", async () => {
    it("Doesn't call in the same sequence every time", async () => { 
        const sut1 = new BingoCaller();       
        const sut2 = new BingoCaller();       

        expect(sut1.availableNumbers).not.toEqual(sut2.availableNumbers);
    }); 
    
    it("Runs out of numbers without crashing", async () => {   
        const sut = new BingoCaller();
        
        for (let i = 0; i < 90; i++) {
            sut.getNextCall();
        } // Exhausted

        const outOfNumbers = sut.getNextCall();

        expect(outOfNumbers.exhausted).toBe(true);
    });
});

describe("BingoCardGenerator", async () => {
    let sut;
    beforeEach(() => {
        sut = new BingoCardGenerator();
    });

    it("Can create a card", async () => {  
        const card = sut.generate();
        expect(card).toBeDefined();
    });
});

describe("BingoBlock", async () => {
    let sut;
    beforeEach(() => {
        sut = new BingoBlock();
    });

    it("validateMarkedRows false when no lines completed", async () => {  
        sut.rows = [
            [ 01, 10, 20, 30, 40, 00, 00, 00, 00 ], 
            [ 00, 00, 00, 00, 00, 00, 00, 00, 00 ], 
            [ 00, 00, 00, 00, 00, 00, 00, 00, 00 ],
        ];
        const observedNumbers = [1, 10, 20, 30 ];

        const score = sut.validateMarkedRows(observedNumbers);

        expect(score).toBe(0);
    });

    it("validateMarkedRows identifies one-line-bingo", async () => {  
        sut.rows = [
            [ 01, 10, 20, 30, 40, 00, 00, 00, 00 ], 
            [ 00, 00, 00, 00, 00, 00, 00, 00, 00 ], 
            [ 00, 00, 00, 00, 00, 00, 00, 00, 00 ],
        ];
        const observedNumbers = [1, 10, 20, 30, 40];

        const card = sut.validateMarkedRows(observedNumbers);

        expect(card).toBe(1);
    });

    it("validateMarkedRows won't award the same block prizes twice", async () => {  
        sut.rows = [
            [ 01, 10, 20, 30, 40, 00, 00, 00, 00 ], 
            [ 00, 00, 00, 00, 00, 00, 00, 00, 00 ], 
            [ 00, 00, 00, 00, 00, 00, 00, 00, 00 ],
        ];
        const observedNumbers = [1, 10, 20, 30, 40];

        let score = sut.validateMarkedRows(observedNumbers);
        score = sut.validateMarkedRows(observedNumbers);

        expect(score).toBe(1);
    });

    it("validateMarkedRows identifies two-line-bingo", async () => {  
        sut.rows = [
            [ 01, 10, 20, 30, 40, 00, 00, 00, 00 ], 
            [ 02, 11, 21, 31, 41, 00, 00, 00, 00 ], 
            [ 00, 00, 00, 00, 00, 00, 00, 00, 00 ],
        ];
        const observedNumbers = [1, 10, 20, 30, 40, 2, 11, 21, 31, 41];

        const score = sut.validateMarkedRows(observedNumbers);

        expect(score).toBe(2);
    });

    it("validateMarkedRows identifies three-line-bingo", async () => {  
        sut.rows = [
            [ 01, 10, 20, 30, 40, 00, 00, 00, 00 ], 
            [ 02, 11, 21, 31, 41, 00, 00, 00, 00 ], 
            [ 03, 12, 22, 32, 42, 00, 00, 00, 00 ],
        ];
        const observedNumbers = [1, 10, 20, 30, 40, 2, 11, 21, 31, 41, 3, 12, 22, 32, 42];

        const score = sut.validateMarkedRows(observedNumbers);

        expect(score).toBe(3);
    });
});

describe("BingoCard", async () => {
    let sut;
    beforeEach(() => {
        sut = new BingoCard();
        const numbers = [
            [ 01, 10, 20, 30, 40, 00, 00, 00, 00 ], 
            [ 02, 11, 21, 31, 41, 00, 00, 00, 00 ], 
            [ 03, 12, 22, 32, 42, 00, 00, 00, 00 ],
        ];
        sut.blocks = [ 
            new BingoBlock(numbers),
        ];
    });

    it("checkForAwards correctly awards one line bingo", async () => {  
        const observedNumbers = [1, 10, 20, 30, 40];
        const result = sut.checkForAwards(observedNumbers);
        
        expect(result.award).toBe("one-line");
    });  
});