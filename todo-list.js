const List = React.createClass({
    render() {
        return (
            <div className={this.props.status == false ? "list-title" : "list-title finish"}>
            <span className="check" onClick={this.props.onStatus}></span>
            <div className="textarea">{this.props.children}</div>
            <span className="delete-list" onClick={this.props.onDelete}> x </span>
            </div>
        );
    }
});

const AddList = React.createClass({
    getInitialState() {
        return {
            title: ''
        };
    },

    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    },

    handleListAdd() {
        const newList = {
            title: this.state.title,
            status: false,
            id: Date.now()
        };

        this.props.onListAdd(newList);
        this.setState({ title: "" });
    },

    render() {
        return (
            <div className="add-list">
                <input type="text" placeholder="What you need to do?" value={this.state.title} onChange={this.handleTitleChange} />
                <button className="add-button" onClick={this.handleListAdd}>Add</button>
            </div>
        );
    }
});

const ListTable = React.createClass({

    render() {
        const onListDelete = this.props.onListDelete;
        const onListStatus = this.props.onListStatus;
        return (
            <div className="list-table">
                {
                    this.props.lists.map(function(list) {
                        return (
                            <List
                                key={list.id}
                                status={list.status}
                                onDelete={onListDelete.bind(null, list)}
                                onStatus={onListStatus.bind(null, list)}
                                >
                                {list.title}
                                </List>
                            );
                    })
                }
            </div>
        );
    }
});

const ListSort = React.createClass({
    render() {
        const sortButtons = ['all', 'new', 'completed'];
        const onToDoSort = this.props.onToDoSort;
        const currentFilter = this.props.currentFilter;

        return (
            <ul className="list-sort">
              {
                sortButtons.map(name =>
                    <li
                        key={name}
                        className={(name === currentFilter)? 'active': ''}
                        onClick={onToDoSort.bind(null, name)}
                    >
                        {name}
                    </li>
                )
              }
            </ul>
          );
    }
});

const TodoApp = React.createClass({
    getInitialState() {
        return {
            lists: [],
            filter: 'all'
        };
    },

    componentDidMount() {
        const localLists = JSON.parse(localStorage.getItem('lists'));
        if (localLists) {
            this.setState({ lists: localLists });
        }
    },

    componentDidUpdate() {
        this._updateLocalStorage();
    },

    handleListDelete(list) {
        const listId = list.id;
        const newLists = this.state.lists.filter(function(list) {
            return list.id !== listId;
        });
        this.setState({ lists: newLists });
    },

    handleListAdd(newList) {
        var newLists = this.state.lists.slice();
        newLists.unshift(newList);
        this.setState({ lists: newLists});
    },

    handleListStatus(newList) {
        var newLists = this.state.lists.slice();
        newLists.forEach(el => {
          if(el.id === newList.id) {
            el.status = !newList.status
          }
        });
        this.setState({ lists: newLists});
    },

    onToDoSort(filter){
        this.setState({filter: filter});
    },

    render() {
        return (
            <div className="lists-app">
                <h2 className="app-header">To-do list</h2>
                <AddList onListAdd={this.handleListAdd} />
                <ListTable lists={ this._getVisibleToDos(this.state.lists, this.state.filter) } onListDelete={this.handleListDelete} onListStatus={this.handleListStatus} />
                <ListSort currentFilter={this.state.filter}  onToDoSort={this.onToDoSort} />
            </div>
        );
    },

    _getVisibleToDos(todos, filter){
        if (filter === 'completed') {
            return todos.filter(todo => todo.status);
        }
        if (filter === 'new') {
            return todos.filter(todo => !todo.status);
        }

        return todos;
    },

    _updateLocalStorage() {
        const lists = JSON.stringify(this.state.lists);
        localStorage.setItem( 'lists', lists );
    }
});

ReactDOM.render(
    <TodoApp />,
    document.getElementById('mount-point')
);
