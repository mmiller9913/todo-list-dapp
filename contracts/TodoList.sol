pragma solidity >=0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping (uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    //run once, on deployment   
    //without "pulbic", compiler gives an error
    //but it doesn't need to be public?
    constructor() public {
        createTask("This is a dummy task");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);

        //broadcast an event that a task was created
        emit TaskCreated(taskCount, _content, false);
    }
}