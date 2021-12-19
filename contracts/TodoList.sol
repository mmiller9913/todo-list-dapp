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

    event TaskCompleted(
        uint id,
        bool completed
    );

    //run once, on deployment   
    //without "public", compiler gives an error
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

    function toggleCompleted(uint _id) public {
        //get the task out of the mapping
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
}