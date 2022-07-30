import {ethers, network} from "hardhat";
import {expect} from "chai";

const protobuf = require("protobufjs");


describe("Interpreter", function () {
  let machine: any;
  let interpreter: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let accounts: any;
  beforeEach(async function () {
    const Interpreter = await ethers.getContractFactory('Interpreter');
    const Machine = await ethers.getContractFactory('Machine');
    machine = await Machine.deploy()
    accounts = await ethers.getSigners();
    [owner, user1, user2] = accounts;
  });


  describe("basic interpreter", function () {
    it("test push", async function () {
      // push 1 to stack
      await machine.dispatch_instructions([0x0101]);
      let interpreterAddress = await machine.userInterpreter(owner.address);
      interpreter = await ethers.getContractAt('Interpreter', interpreterAddress);
      expect(await interpreter.userStack(0)).to.be.equal(1);
    });

    it("test pop", async function () {
      // push 1,2 to stack, pop 1 element
      await machine.dispatch_instructions([0x0101, 0x0102, 0x0201]);
      let interpreterAddress = await machine.userInterpreter(owner.address);
      interpreter = await ethers.getContractAt('Interpreter', interpreterAddress);
      expect(await interpreter.userStack(0)).to.be.equal(1);
    });

    it("test aritmetic ops", async function () {
      // [] => add [3, 4] => 7
      await machine.dispatch_instructions([0x0103, 0x0104, 0x0300]);
      let interpreterAddress = await machine.userInterpreter(owner.address);
      interpreter = await ethers.getContractAt('Interpreter', interpreterAddress);
      expect(await interpreter.userStack(0)).to.be.equal(7);

      // [7] => push [15] => sub 15 - 7 => [8]
      await machine.dispatch_instructions([0x010F, 0x0400]);
      interpreterAddress = await machine.userInterpreter(owner.address);
      interpreter = await ethers.getContractAt('Interpreter', interpreterAddress);
      expect(await interpreter.userStack(0)).to.be.equal(8);

      // [8] => push [2] => mul 8 * 2 => [16]
      await machine.dispatch_instructions([0x0102, 0x0500]);
      interpreterAddress = await machine.userInterpreter(owner.address);
      interpreter = await ethers.getContractAt('Interpreter', interpreterAddress);
      expect(await interpreter.userStack(0)).to.be.equal(16);
    });
  });

  describe("interpreter with protobuf", function () {
    it("test user protobuf as the serialization protocol", async function () {
      let root = await protobuf.load("./interpreter.proto")
      let PushMessage = root.lookupType("interpreter.Push");
      let PopMessage = root.lookupType("interpreter.Pop");
      let AddMessage = root.lookupType("interpreter.Add");
      let InstructionMessage = root.lookupType("interpreter.Instruction");
      let InstructionsMessage = root.lookupType("interpreter.Instructions");
      let ProgramMessage = root.lookupType("interpreter.Program");
      let pushMessage = PushMessage.create({value: 1});
      console.log(PushMessage.toObject(pushMessage))
      console.log(pushMessage)

      let instructionMessage = InstructionMessage.create(InstructionMessage.toObject({push: pushMessage}, {oneofs: true}))
      console.log(InstructionMessage.fromObject(instructionMessage))

      let pushMessage2 = PushMessage.create({value: 2})
      let instructionMessage2 = InstructionMessage.create(InstructionMessage.toObject({push: pushMessage2}, {oneofs: true}))
      console.log(InstructionMessage.fromObject(instructionMessage2))

      let addMessage = AddMessage.create({})
      let instructionMessage3 = InstructionMessage.create(InstructionMessage.toObject({add: addMessage}, {oneofs: true}))
      console.log(InstructionMessage.fromObject(instructionMessage3))

      let instructionsMessage = InstructionsMessage.create(InstructionsMessage.toObject({instructions: [instructionMessage, instructionMessage2, instructionMessage3]}))
      let programMessage = ProgramMessage.create(ProgramMessage.toObject({instructions: instructionsMessage}));

      let res = ProgramMessage.verify(programMessage);

      let encodedProgram = ProgramMessage.encode(programMessage).finish().toString("hex");
      console.log("encoded program", encodedProgram);
      await machine.dispatch_program("0x" + encodedProgram);

      // check the result
      let interpreterAddress = await machine.userInterpreter(owner.address);
      interpreter = await ethers.getContractAt('Interpreter', interpreterAddress);
      expect(await interpreter.userStack(0)).to.be.equal(3);

      // test again: change value
      let popMessage = PopMessage.create({value: 1});
      instructionMessage = InstructionMessage.create(InstructionMessage.toObject({pop: popMessage}, {oneofs: true}))
      console.log(InstructionMessage.fromObject(instructionMessage))
      instructionMessage2 = InstructionMessage.create(InstructionMessage.toObject({push: pushMessage2}, {oneofs: true}))
      console.log(InstructionMessage.fromObject(instructionMessage2))
      instructionsMessage = InstructionsMessage.create(InstructionsMessage.toObject({instructions: [instructionMessage, instructionMessage2]}))
      programMessage = ProgramMessage.create(ProgramMessage.toObject({instructions: instructionsMessage}));

      encodedProgram = ProgramMessage.encode(programMessage).finish().toString("hex");
      console.log("encoded program", encodedProgram);
      await machine.dispatch_program("0x" + encodedProgram);
      expect(await interpreter.userStack(0)).to.be.equal(2);

    })
  })
});
