const assert = require("assert");

const TodoList = artifacts.require('./TodoList.sol');

contract('TodoList', (accounts) => {
    //get deployed copy of the smart contract with a before hook
    //"before" each test run, pass async function that gets copy of smart contract that's deployed to the blockchain
    before(async() => {
        this.todoList = await TodoList.deployed();
    })

    it('deploys successfuly', async() => {
        //make sure the address exists 
        const address = await this.todoList.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    it('lists tasts', async() => {
        const taskCount = await this.todoList.taskCount();
        const task = await this.todoList.tasks(1); //make sure a task exists where the task count is
        assert.equal(task.id.toNumber(), taskCount.toNumber()); //making sure task id = task count
        assert.equal(task.content, 'This is a dummy task'); //making sure the task content = argument
        assert.equal(task.completed, false); //making sure the task is not completed
        assert.equal(taskCount.toNumber(), 1); //checking taskcount = 1
    })

    it('creates tasks', async() => {
        const result = await this.todoList.createTask('A new task');
        const taskCount = await this.todoList.taskCount();
        assert.equal(taskCount, 2);
        const event = result.logs[0].args; //check that event was triggered
        // console.log(event); //would appear in the truffle console
        assert.equal(event.id.toNumber(), 2);
        assert.equal(event.content, 'A new task');
        assert.equal(event.completed, false);
    })
})

//to run this file, run "truffle test" in the console