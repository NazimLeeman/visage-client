import { useEffect, useState, useRef } from "react"
import { Chart } from "chart.js";
import Table from "./table";
function DetailsChart() {
    const [chartData, setChartData] = useState(null);
    const [sorted, setSorted] = useState(false);
    const [chartType, setChartType] = useState("bar");
    const [showTable, setShowTable] = useState(false);
    const [dataForTable, setDataForTable] = useState(null);
    const [chartInstance, setChartInstance] = useState(null);

    const originalLabels = useRef(null);

    useEffect(() => {
        fetch('http://localhost:4000/all/answer')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                const answersArr = [];
                const trimmedArr = [];
                data.forEach(answer => {
                        const value = answer.answer;
                        console.log(value)
                        if (value && !answersArr.includes(value)) {
                            const trimmedValue = value && value.length > 15 ? value.slice(0, 15) : value;
                            trimmedArr.push(trimmedValue)
                            answersArr.push(value);
                            console.log(trimmedArr)
                            console.log(answersArr)
                        }
                    });
                console.log(answersArr);
                const answersArrCounts = answersArr.reduce((counts, answersArr) => {
                    counts[answersArr] = 0;
                    return counts;
                }, {});
                console.log(data)
                data.forEach(item => {
                    if (item.answer && answersArrCounts.hasOwnProperty(item.answer)) {
                        answersArrCounts[item.answer]++;
                    }
                });
                const datas = answersArr.map(answersArr => answersArrCounts[answersArr]);
                console.log(datas)
                const colors = [
                    '#71d1bd', '#ffcccb', '#7e57c2', '#ffb74d', '#4fc3f7',
                    '#f06292', '#7986cb', '#ff8a65', '#a1887f', '#4db6ac',
                    '#ba68c8', '#ffd54f', '#4dd0e1', '#81c784', '#9575cd',
                    '#ffb74d', '#4fc3f7', '#f06292', '#7986cb', '#ff8a65'
                ];
                const originalLabelsData = answersArr;
                originalLabels.current = originalLabelsData;
                const labels = trimmedArr;
                const datasets = [
                    {
                        label: 'Answers',
                        backgroundColor: colors,
                        data: datas,
                    }
                ];
                setChartData({ labels, datasets });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        if (chartData) {
            renderChart();
        }
    }, [chartData, sorted]);

    useEffect(() => {
        if (chartData) {
            renderChart();
        }
    }, [chartType]);

    let myChart = null;

    const renderChart = () => {
        const sortedChartData = sorted ? sortChartData(chartData) : chartData;
        if (chartInstance) {
            chartInstance.destroy();
        }
        console.log(chartData)
        console.log(sorted);
        console.log(sortedChartData)
        var ctx = document.getElementById('myChart').getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: chartType,
            data: sortedChartData,
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                            const currentValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            const totalValue = data.datasets[tooltipItem.datasetIndex].data.reduce((total, value) => total + value, 0);
                            const percentage = ((currentValue / totalValue) * 100).toFixed(1);
                            return `${datasetLabel}: ${currentValue} (${percentage}%)`;
                        },
                        footer: (tooltipItems, data) => {
                            const totalValue = data.datasets[0].data.reduce((total, value) => total + value, 0);
                            return `Total: ${totalValue}`;
                        }
                    }
                }
            },
        });
        setChartInstance(newChartInstance);
        const tableData = {
            labels: originalLabels.current,
            datasets: chartData.datasets,
        };
        setDataForTable(tableData);
        console.log(dataForTable)
    };

    

    const sortChartData = (data) => {
    // const sortedData = { ...data }; 
    const sortedData = {
        labels: [...data.labels],
        datasets: data.datasets.map(dataset => ({
            label: dataset.label,
            backgroundColor: dataset.backgroundColor,
            data: [...dataset.data]
        }))
    };
    if (sorted) {
        const originalOrder = sortedData.labels.map((_, index) => index);

        const sortedIndexes = originalOrder.sort((a, b) => sortedData.datasets[0].data[b] - sortedData.datasets[0].data[a]);
        sortedData.labels = sortedIndexes.map(index => data.labels[index]);
        sortedData.datasets.forEach(dataset => {
            dataset.data = sortedIndexes.map(index => data.datasets[0].data[index]);
        });
    } else {
        sortedData.labels = data.labels;
        sortedData.datasets.forEach((dataset, i) => {
            dataset.data = data.datasets[i].data;
        });
    }

    console.log(sortedData);
    return sortedData;
    };

    const handleClick = () => {
        setSorted(!sorted); 
        console.log(sorted)
    };

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleToggleTable = () => {
        setShowTable(!showTable); 
    };


    


    return (
        <>
            {/* Stacked chart */}
            <h1 className="w-[500px] mx-auto my-5 text-xl text-red-500 font-semibold capitalize ">How do you know or discover Singha beer?</h1>
            <button className="px-5 py-2 mx-5 my-5 text-green-500 bg-black rounded-lg" onClick={handleClick}>
    {sorted ? "Unsort Chart" : "Sort Chart"}
</button>
<select className="px-4 py-2 mx-5 my-5 text-black bg-sky-300 rounded-lg" value={chartType} onChange={handleChartTypeChange}>
                <option value="bar">Vertical Bars</option>
                <option value="horizontalBar">Horizontal Bars</option>
                <option value="pie">Pie</option>
                <option value="radar">Spider</option>
            </select>
            <button className="px-5 py-2 mx-5 my-5 text-green-500 bg-black rounded-lg" onClick={handleToggleTable}>
                {showTable ? "Hide Table" : "Show Table"}
            </button>
            <div className="w-[800px] flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
            {showTable && (
    <div id="tableContainer">
        <Table data={dataForTable}/>
    </div>
)}
        </>
    )
}

export default DetailsChart;