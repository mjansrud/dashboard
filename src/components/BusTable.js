import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class BusTable extends Component {
    constructor(props) {
        super(props);
        moment.defineLocale('nb-fix', {
            parentLocale: 'nb',
            relativeTime: {
                future: ' %s'
            }
        });
        this.state = {
            stop: []
        }
    }

    componentWillMount() {
        var app = this;
        app.loadToStopData();
        setInterval(() => {
            console.log('Fetching data');
            app.loadToStopData();
        }, 10000);

    }

    loadToStopData() {
        fetch('https://api.founder.no/atb/stop/' + this.props.stopCode).then((response) => response.json()).then((responseJson) => {
            this.setState({
                stop: responseJson.next.slice(0, 6)
            });
        }).catch((error) => {
            //console.error(error);
        })
    }

    render() {
        var stop = this.state.stop;
        return (
            <Table condensed responsive>
                <tbody>
                    <tr>
                        <td className='col-md-3'>Buss</td>
                        <td className='col-md-5'>Mot</td>
                        <td className='col-md-4 align-right'>Ankomst</td>
                    </tr>
                    {stop.map((bus) => {
                        let arrival = new Date(bus.t.substring(6, 10) + "-" + bus.t.substring(3, 5) + "-" + bus.t.substring(0, 2) + " " + bus.t.substring(11, 13) + ":" + bus.t.substring(14, 16));
                        if (arrival - new Date() > 0) {
                            if (arrival - new Date() < 30000) {
                                return (
                                    <tr>
                                        <td className='col-md-3'>{bus.l}</td>
                                        <td className='col-md-5'>{bus.d}</td>
                                        <td className='col-md-4 align-right'>nå</td>
                                    </tr>
                                );
                            }
                            return (
                                <tr>
                                    <td className='col-md-3'>{bus.l}</td>
                                    <td className='col-md-5'>{bus.d}</td>
                                    <td className='col-md-4 align-right'>{moment(arrival).fromNow()}</td>
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </Table>
        );
    }
}

export default BusTable;