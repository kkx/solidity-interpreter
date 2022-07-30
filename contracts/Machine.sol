// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Interpreter.sol";

/**
 * @title Machine
 * @notice Interpreter fabric for users
 */

contract Machine {
    mapping(address => address) public userInterpreter;

    function _get_or_create_interpreter(address user) private returns (address) {
        address interpreterAddress = userInterpreter[user];
        if (interpreterAddress == address(0)) {
            interpreterAddress = address(new Interpreter(user));
            userInterpreter[user] = interpreterAddress;
        }
        return interpreterAddress;
    }

    function dispatch_instructions(uint16[] calldata instructions) public {
        Interpreter(_get_or_create_interpreter(msg.sender)).interpret(instructions);
    }

    function dispatch_program(bytes calldata program) public {
        Interpreter(_get_or_create_interpreter(msg.sender)).interpretWithProtoBuff(program);
    }
}
