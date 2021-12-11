//to use web3js must npm install and use script tag in html
App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  // web3.js is a JavaScript library that allows our client-side application to talk to the blockchain
  // this is copy-pasted based on what MetaMask suggests here - https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //if the user has metamask installed
    if (window.ethereum) { //window.ethereum serves as the web3 provider, don't need to set one 
      console.log('MetaMask is installed!');
      App.web3Provider = window.ethereum;
      //see: https://ethereum.stackexchange.com/questions/92095/web3-current-best-practice-to-connect-metamask-to-chrome/92097
    }
    //legacy dapp browsers
    //this used to be the old way MetaMask did things -- they injected a web3 provider & created a web3 instance
    else if (window.web3) {
      // Use Mist/MetaMask's provider
      console.log('Injected web3 detected.');
      App.web3Provider = window.web3.currentProvider;
        // new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    web3 = new Web3(App.web3Provider);
  },

  loadAccount: async () => {
    // Set the current blockchain account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    App.account = accounts[0];
    web3.eth.defaultAccount = web3.eth.accounts[0];
  },

  loadContract: async () => {
    //Create a JavaScript version of the smart contract
    //Get smart contract JSON file 
    const todoList = await $.getJSON('TodoList.JSON');

    //create truffle contract (AKA a JS representation of the smart contract that allows you to call its functions)
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    //get deployed version of smart contract 
    App.todoList = await App.contracts.TodoList.deployed();
  },

  render: async () => {
    //need to prevent double rendering
    if (App.loading) {
      return
    }
    App.setLoading(true);

    //render the account
    $('#account').html(App.account);

    // Render Tasks
    await App.renderTasks();

    App.setLoading(false);
  },

  renderTasks: async () => {

    //load task count from the blockchain
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (i = 1; i <= taskCount; i++) {
      //get task data from the blockchain
      const task = await App.todoList.tasks(i); //this returns an array mathing the task struct
      const taskId = task[0];
      const taskContent = task[1];
      const taskCompleted = task[2];

      //create html for the task
      const $newTaskTemplate = $taskTemplate.clone(); //clone task template fetched from the DON
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
        .prop('name', taskId) //in the input, sets name="taskId"
        .prop('checked', taskCompleted)//in the input, sets checeked="true/fa;se"
      // .on('click', App.toggleCompleted)

      //put the task in the correct list 
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate);
      } else {
        $('#taskList').append($newTaskTemplate);
      }

      // Show the task
      $newTaskTemplate.show()
    }

  },

  createTask: async() => {
    App.setLoading(true);
    const content = $('#newTask').val();
    console.log(content);
    await App.todoList.createTask(content);
    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }

}

document.addEventListener("DOMContentLoaded", function (event) {
  App.load();
});