var ToDo = React.createClass({
  render: function() {
    return ( < li className = {
        "to-do" + (this.props.status ? ' done' : '')
      } >
      < span className = "accept"
      onClick = {
        this.props.onToDoAccept
      } > < /span> < span className = "text" > {
      this.props.children
    } < /span> < span className = "delete-task"
    onClick = {
      this.props.onDelete
    } > × < /span> < /li >
  );
}
});

var ToDoList = React.createClass({
  render: function() {
    var onToDoDelete = this.props.onToDoDelete;
    var onToDoAccept = this.props.onToDoAccept;


    return ( < ul className = "to-do-list" > {
        this.props.tasks.map(function(task) {
          return <ToDo
          key = {
            task.id
          }
          status = {
            task.status
          }
          onDelete = {
            onToDoDelete.bind(null, task)
          }
          onToDoAccept = {
            onToDoAccept.bind(null, task)
          } > {
            task.text
          } < /ToDo>
        })
      } < /ul>);
    }
  });

var ToDoAdd = React.createClass({
  render: function() {
    return ( < div className = "to-do-add" >
      < input type = "text"
      ref = "addInput"
      placeholder = "What you need to do?"
      onKeyPress = {
        this._handleKeyPress
      }
      /> < /div >
    );
  },

  _handleKeyPress: function(e) {
    var value = e.target.value.replace(/\s{2,}/g, ' ');

    if (e.key === 'Enter' && value) {
      var newTask = {
        id: Date.now(),
        text: value,
        status: false
      };

      this.props.onToDoAdd(newTask);
      this.refs.addInput.value = '';
    }
  }
});

var ToDoSort = React.createClass({

  handlerSort: function(e) {
    if (e.target.nodeName === 'LI') {
      var action = e.target.getAttribute('class');

      this.props.onToDoSort(action);
    }
  },

  render: function() {
    return ( < ul className = {
        "to-do-sort " + this.props.sortAction
      }
      onClick = {
        this.handlerSort
      } >
      < li className = "all" > All < /li> < li className = "new" > New < /li > < li className = "completed" > Completed < /li> < /ul >
    );
  }
});

var ToDoListApp = React.createClass({

      getInitialState: function() {
        return {
          tasks: []
        }
      },

      onToDoAdd: function(task) {
        var newTasks = this.state.tasks.slice();
        newTasks.unshift(task);

        this.setState({
          tasks: newTasks
        });
      },

      onToDoDelete: function(task) {
        var newTasks = this.state.tasks.filter(function(el) {
          return el.id !== task.id
        });

        this.setState({
          tasks: newTasks
        });
      },

      onToDoAccept: function(task) {
        var newTasks = this.state.tasks.slice();

        newTasks.forEach(function(el) {
          if (el.id === task.id) {
            el.status = !task.status
          }
        });

        this.setState({
          tasks: newTasks
        });
      },

      onToDoSort: function(sortType) {
        var newTasks;

        if (!this.sortCopyTasks) {
          this.sortCopyTasks = this.state.tasks.slice();
        }

        if (sortType === 'new') {
          newTasks = this.sortCopyTasks.filter(function(el) {
            return !el.status;
          });
        }
        if (sortType === 'completed') {
          newTasks = this.sortCopyTasks.filter(function(el) {
            return el.status;
          });
        }
        if (sortType === 'all') {
          newTasks = this.sortCopyTasks.slice();
          this.sortCopyTasks = null;
        }

        this.sortAction = sortType;
        this.setState({
          tasks: newTasks
        });
      },

      componentWillMount: function() {
        var tasks = localStorage.getItem('tasks');

        if (tasks) {
          tasks = JSON.parse(tasks);
          this.setState({
            tasks: tasks
          });
        }

        this.sortAction = 'all';
      },

      componentDidUpdate: function() {
        if (!this.sortCopyTasks) {
          this._updateLocalStorage();
        }
      },

      render: function() {
        return ( < div className = "to-do-app" >
          < ToDoAdd onToDoAdd = {
            this.onToDoAdd
          }
          /> < ToDoList onToDoDelete = {
          this.onToDoDelete
        }
        onToDoAccept = {
          this.onToDoAccept
        }
        tasks = {
          this.state.tasks
        }
        /> < ToDoSort sortAction = {
        this.sortAction
      }
      onToDoSort = {
        this.onToDoSort
      }
      /> < /div >
    );
  },

  _updateLocalStorage: function() {
    var tasks = JSON.stringify(this.state.tasks);
    localStorage.setItem('tasks', tasks);
  }
});

ReactDOM.render( < ToDoListApp / > ,
  document.getElementById('mount-point')
);
