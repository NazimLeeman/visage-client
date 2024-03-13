import { useEffect, useState } from "react"
import { Chart } from "chart.js";
function StackedBar() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/all/age')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                const ageRanges = ["21-24", "25-30", "31-35", "36-40", "41-45"];
                const maleCounts = Array.from({ length: ageRanges.length }, () => 0);
                const femaleCounts = Array.from({ length: ageRanges.length }, () => 0);
                data.forEach(item => {
                    const ageIndex = ageRanges.findIndex(range => range === item.age);
                    if (ageIndex !== -1) {
                        if (item.gender === 'Male') {
                            maleCounts[ageIndex]++;
                        } else if (item.gender === 'Female') {
                            femaleCounts[ageIndex]++;
                        }
                    }
                });
                const labels = ageRanges;
                const datasets = [
                    {
                        label: 'Male',
                        backgroundColor: "#71d1bd",
                        data: maleCounts,
                    },
                    {
                        label: 'Female',
                        backgroundColor: "#ffcccb",
                        data: femaleCounts,
                    }
                ];
                setChartData({ labels, datasets });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: chartData,
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }],
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                            const currentValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            let totalValue = 0;
    data.datasets.forEach(dataset => {
        totalValue += dataset.data[tooltipItem.index];
    });
    const percentage = ((currentValue / totalValue) * 100).toFixed(1);
                            return `${datasetLabel}: ${currentValue} (${percentage}%)`;
                        },
                        footer: (tooltipItems, data) => {
                            const datasetIndex = tooltipItems[0].datasetIndex;
                            const currentValueIndex = tooltipItems[0].index;
                            let totalValue = 0;
                            data.datasets.forEach(dataset => {
                                const currentValue = dataset.data[currentValueIndex];
                                totalValue += currentValue;
                            });
                            return `Total: ${totalValue}`;
                        }
                    }
                }
            },
        });
    }, [chartData])


    return (
        <>
            {/* Stacked chart */}
            <h1 className="w-[200px] mx-auto my-10 text-xl text-red-500 font-semibold capitalize ">Age & Gender</h1>
            <div className="w-[800px] flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
        </>
    )
}

export default StackedBar;