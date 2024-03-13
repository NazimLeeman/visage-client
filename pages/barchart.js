import { useEffect, useState } from "react"
import { Chart } from "chart.js";
function LocationBar() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/all/location')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                const locations = ["California", "Florida", "New York", "Virginia", "Washington"];
                const locationCounts = locations.reduce((counts, location) => {
                    counts[location] = 0;
                    return counts;
                }, {});
            
                // Count the occurrences of each location
                data.forEach(item => {
                    if (item.location && locationCounts.hasOwnProperty(item.location)) {
                        locationCounts[item.location]++;
                    }
                });
                const datas = locations.map(location => locationCounts[location]);
                const colors = ['#71d1bd', '#ffcccb', '#7e57c2', '#ffb74d', '#4fc3f7'];
                const labels = locations;
                const datasets = [
                    {
                        label: 'Amount',
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
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: chartData,
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
    }, [chartData])


    return (
        <>
            {/* Stacked chart */}
            <h1 className="w-[200px] mx-auto my-10 text-xl text-red-500 font-semibold capitalize ">Locations</h1>
            <div className="w-[800px] flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
        </>
    )
}

export default LocationBar;