const List = React.createClass({
    render() {
        return (
            <div className={this.props.status == false ? "list-title" : "list-title finish"}>
            <span class="check" ></span>
            <div class="textarea">{this.props.children}</div>
            {this.props.status ? "✓ Photo Added" : "Add Photo" }
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
        return (
            <div className="list-table">
                {
                    this.props.lists.map(function(list) {
                        return (
                            <List
                                key={list.id}
                                status={list.status}
                                onDelete={onListDelete.bind(null, list)}
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
        return (
            <div className="list-sort">
            <div className="menu-item">All</div>
            <div className="menu-item">New</div>
            <div className="menu-item">Completed</div>
            </div>
            )
    }
});

const TodoApp = React.createClass({
    getInitialState() {
        return {
            lists: []
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

    render() {
        return (
            <div className="lists-app">
                <h2 className="app-header">To-do list</h2>
                <AddList onListAdd={this.handleListAdd} />
                <ListTable lists={this.state.lists} onListDelete={this.handleListDelete} />
                <ListSort />
            </div>
        );
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
