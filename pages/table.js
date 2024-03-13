import React from "react";

function Table({ data }) {
    const tableContainerStyle = {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center', 
       margin: '2rem'
    };

    const tableStyle = {
        borderCollapse: 'collapse',
        width: '80%', 
    };

    const thStyle = {
        border: '1px solid #dddddd',
        textAlign: 'left',
        padding: '8px',
        backgroundColor: '#f2f2f2',
        color: 'black',
    };

    const tdStyle = {
        border: '1px solid #dddddd',
        textAlign: 'left',
        padding: '8px',
        color: 'black',
    };
    return (
        <div style={tableContainerStyle}>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Answer</th>
                        <th style={thStyle}>Response</th>
                    </tr>
                </thead>
                <tbody>
                    {data.labels.map((label, index) => (
                        <tr key={index}>
                            <td style={tdStyle}>{label}</td>
                            <td style={tdStyle}>{data.datasets[0].data[index]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
