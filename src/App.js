import { Component } from 'react';
import { LineChart } from 'react-d3-basic';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        const url = this.props.dataUrl;
        xhr.open(`GET`, url, true);
        xhr.onload = (event) => {
            const isReady = xhr.readyState === 4;
            const isSuccess = xhr.status = 200;
            if (isReady) {
                if (isSuccess) {
                    this.setState({
                        data: JSON.parse(xhr.response),
                    });
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = (event) => {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }

    render() {
        return (
            <div>
                <LineChart
                    width={ 600 }
                    height={ 300 }
                    data={ this.state.data }
                />
            </div>
        );
    }
}

export default App;
