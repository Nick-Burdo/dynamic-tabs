import React from 'react';

class DummyTable extends React.Component {
    render() {
        return (
            <div>
                <h1>Dummy Table</h1>

                <table>
                    <thead>
                    <tr>
                        <th>header 1</th>
                        <th>header 2</th>
                        <th>header 3</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>data 1.1</td>
                        <td>data 1.2</td>
                        <td>data 1.3</td>
                    </tr>
                    <tr>
                        <td>data 2.1</td>
                        <td>data 2.2</td>
                        <td>data 2.3</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default DummyTable;

 
