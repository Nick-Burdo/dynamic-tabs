import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import config from './config';
import asyncComponent from './components/asyncComponent';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsData: [],
            errorLoading: false
        };
    }

    errorLoading(ex) {
        console.log('MODULE LOADING ERROR\n', ex);
    };

    componentWillMount() {
        fetch(config.tabsDataUrl)
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    tabsData: json.sort((a, b) => a.order - b.order)
                });
            })
            .catch((ex) => {
                console.log('parsing failed', ex)
            });
    }

    render() {
        let FirstComponent = null;
        if (this.state.tabsData.length > 0) {
            FirstComponent = asyncComponent(() => System.import('./components/' + this.state.tabsData[0].path)
                .then(module => module.default).catch(this.errorLoading), {});
        }


        return (
            <Router>
                <div className="App">
                    <ul>
                        {
                            this.state.tabsData.map(tab => (
                                <li key={tab.id}>
                                    <Link to={"/" + tab.id}>
                                        {tab.title}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>

                    <hr />

                    {
                        FirstComponent ?
                            <Route path="/" exact component={FirstComponent}/> : ''
                    }

                    {
                        this.state.tabsData.map((tab) => {
                            const Component = asyncComponent(() => System.import('./components/' + tab.path)
                                .then(module => module.default).catch(this.errorLoading), {});
                            return (
                                <Route key={tab.id} path={"/" + tab.id} component={Component}/>
                            )
                        })
                    }

                </div>
            </Router>
        )
    }
}

export default App;